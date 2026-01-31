const Subscription = require('../models/Subscription');

/**
 * @desc    Get subscription status
 * @route   GET /api/subscription
 * @access  Private
 */
const getSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user.id });

    // Create free subscription if none exists
    if (!subscription) {
      subscription = await Subscription.create({
        user: req.user.id,
        plan: 'free'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        plan: subscription.plan,
        isActive: subscription.isValid(),
        expiresAt: subscription.expiresAt,
        startsAt: subscription.startsAt,
        autoRenew: subscription.autoRenew,
        features: subscription.features
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Subscribe to a plan
 * @route   POST /api/subscription/subscribe
 * @access  Private
 */
const subscribe = async (req, res) => {
  try {
    const { plan, paymentReference, duration = 30 } = req.body;

    if (!['basic', 'premium', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    let subscription = await Subscription.findOne({ user: req.user.id });

    if (!subscription) {
      subscription = await Subscription.create({ user: req.user.id });
    }

    // Set plan features based on plan type
    const planFeatures = {
      basic: {
        unlimitedDownloads: false,
        prioritySupport: false,
        noAds: true,
        exclusiveContent: false
      },
      premium: {
        unlimitedDownloads: true,
        prioritySupport: true,
        noAds: true,
        exclusiveContent: false
      },
      enterprise: {
        unlimitedDownloads: true,
        prioritySupport: true,
        noAds: true,
        exclusiveContent: true
      }
    };

    // Add to history
    subscription.history.push({
      plan: subscription.plan,
      startsAt: subscription.startsAt,
      expiresAt: subscription.expiresAt,
      paymentReference: subscription.paymentReference
    });

    // Update subscription
    subscription.plan = plan;
    subscription.isActive = true;
    subscription.startsAt = new Date();
    subscription.expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    subscription.paymentReference = paymentReference;
    subscription.features = planFeatures[plan];

    await subscription.save();

    res.status(200).json({
      success: true,
      message: `Successfully subscribed to ${plan} plan`,
      data: {
        plan: subscription.plan,
        isActive: subscription.isValid(),
        expiresAt: subscription.expiresAt,
        features: subscription.features
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Cancel subscription
 * @route   POST /api/subscription/cancel
 * @access  Private
 */
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (subscription.plan === 'free') {
      return res.status(400).json({
        success: false,
        message: 'You are on the free plan'
      });
    }

    // Disable auto-renew instead of immediate cancellation
    subscription.autoRenew = false;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription will not renew after expiry',
      data: {
        plan: subscription.plan,
        expiresAt: subscription.expiresAt,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get subscription plans
 * @route   GET /api/subscription/plans
 * @access  Public
 */
const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        name: 'free',
        price: 0,
        duration: 'Forever',
        features: [
          'Access to free past questions',
          'Basic timetable features',
          'Task management',
          'Limited downloads per day'
        ]
      },
      {
        name: 'basic',
        price: 500,
        duration: '30 days',
        features: [
          'Everything in Free',
          'No ads',
          '10 downloads per day',
          'Email notifications'
        ]
      },
      {
        name: 'premium',
        price: 1500,
        duration: '30 days',
        features: [
          'Everything in Basic',
          'Unlimited downloads',
          'Priority support',
          'Early access to new features'
        ]
      },
      {
        name: 'enterprise',
        price: 5000,
        duration: '30 days',
        features: [
          'Everything in Premium',
          'Exclusive content',
          'Group features',
          'Dedicated support'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching plans',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getSubscription,
  subscribe,
  cancelSubscription,
  getPlans
};
