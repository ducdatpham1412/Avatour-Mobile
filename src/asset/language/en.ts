const common = {
    yes: 'Yes',
    no: 'No',
    imageUpload: {
        selected: 'Selected',
        cancel: 'Cancel',
    },
    // option image picker
    chooseFromLibrary: 'Choose from library',
    chooseFromCamera: 'Open camera',
    cancel: 'Cancel',
    next: 'Next',
    done: 'Done',
    save: 'Save',
    canNotSave: 'Can not save',
    success: 'Success',
    seeMore: '...See more',
    seeLess: '...See less',
    letGo: "Let's go",
    continue: 'Continue',
    reply: 'Reply',
    anonymous: '@Anonymous',
    writeSomething: 'Your caption',
    discard: 'Discard',
    stay: 'Stay',
    wantToDiscard: 'You want to discard the changes?',
    null: '',
    search: 'Search',
    change: 'Change',
};

const login = {
    component: {
        sendOTP: {
            header: 'Confirm OTP',
            enterCode: 'Enter',
            confirmButton: 'Confirm',
            sendAgain: 'Re-send ({{countdown}})',
            sendAgainNoCount: 'Re-send',
            notiOTP: 'Please enter verification code Doffy have sent to',
        },
    },
    forgetPassword: {
        type: {
            header: 'Forgot password',
            chooseMethod: 'Choose method restoring password',
            user: 'Username',
            username: 'Enter your email',
            continue: 'Continue',
            comeToFacebook: 'Come to facebook',
        },
        send: {
            header: 'Forgot password',
            receiveThrow: 'Receive OTP via',
            phone: 'Phone',
        },
        form: {
            header: 'Set up password',
            newPass: 'New password',
            confirmPass: 'Confirm password',
            buttonDone: 'Done',
        },
    },
    signUp: {
        type: {
            header: 'Sign up',
            chooseMethod: 'Choose method signing up',
            phone: 'Phone',
        },
        form: {
            header: 'Sign up',
            username: 'Username',
            password: 'Password',
            confirmPass: 'Confirm password',
            confirmButton: 'Confirm',
            enterEmail: 'Email',
            enterPhone: 'Phone number',
        },
        hadReadAndAgree: 'I have read and agree to',
        doffyTermsAndPolicy: 'Terms Of Use',
    },
    detailInformation: {
        title: 'Edit information',
        man: 'Male',
        woman: 'Female',
        notToSay: 'Prefer not to say',
        firstChooseGender: 'First, choose your gender:',
        enterYourName: 'Enter your name:',
        chooseBirthday: 'Choosing birthday',
    },
    loginScreen: {
        slogan: 'Chat and find interesting friends',
        username: 'Email',
        password: 'Password',
        keepSignIn: 'Keep sign in',
        signIn: 'Sign in',
        byLoginOrTappingEnjoy:
            'By logging in or tapping "Enjoy without account",\nyou agree to our',
        termsOfUse: 'Terms Of Use',
        learnMore: '. Learn more about how we process your data in our',
        privacyPolicy: 'Privacy Policy',
        yourAccountIsBeingLock:
            'Your account is temporarily locked.\nBy tapping Continue, you confirm unlock your account.',
        continue: 'Continue',
        openAccountSuccess: 'Open account successfully!',
    },
    agreeTermOfService: {
        registerSuccess: 'Register successfully',
        agreeTermOfService: "Let's go",
        contentSuggest:
            'Register successfully! 🥰\nNow let’s go editting your profile',
    },
    enjoy: 'Enjoy',
    login: 'Login',
    register: 'Sign up',
    enjoyModeNoAcc: 'Enjoy app without account',
    forgotPassword: 'Forgot password?',
    orSignIn: 'Sign in with:',
};

// DISCOVERY ROUTE
const discovery = {
    home: 'Home',
    bubble: {
        goToSignUp: 'Go to login so you can start chatting with everyone',
        joinCommunity: 'Join community',
    },
    report: {
        title: 'Report',
        reportPerson: 'Report {{name}}',
        chooseReason: '※ Choose a reason for report this user:',
        offensiveLanguage: 'Profanity, offensive language',
        dangerousAction: 'Dangerous behavior that threatens me or peole',
        spamRuining: 'Spam keeps ruining my experience',
        insultToMe: 'Insult to my personal honor',
        otherReason: 'Others',
        detailDescription: 'Detailed description:',
        uploadImage: 'If possible, send us some pictures:',
        sendReport: 'Send report',
        reportHadSent:
            'Your report has been sent\nWe will review this report and the denounced user for timely handling measures\n\nThank you for joining hands for a better Doffy community\n\nBest regards!\nDoffy Co.',
    },
    seeDetailImage: 'Watch image',
    share: {
        title: 'Share',
    },
    all: 'All',
    like: 'Like',
    numberLike: '{{value}} likes',
    comment: 'Comment',
    numberComments: '{{numberComments}} comments',
    chooseTopic: 'Travel categories',
    applicationPeriod: 'Application period',
    retailPrice: 'Retail price',
    groupBuyingPrice: 'Group prices',
    numberPeople: '{{value}} people',
    joinNow: 'Join now',
    joinGroupBuying: 'Group buying',
    buySeparately: 'Buy separately',
    continueJoin: 'Continue joining',
    joined: 'Joined',
    deposited: 'Deposited',
    numberGroupJoined: '{{value}} groups joined',
    beTheFirstJoin: 'Be the first person join this campaign',
    bought: 'Full payment',
    confirmBought: 'Full payment confirm',
    participators: '{{value}} participators',
    gbExpired: 'Store is temporarily not accepting more orders',
    reviewAbout: "You're writing review about ",
    goToProfile: 'Visit profile',
    openLink: 'Open link',
    dayRemain: '{{value}} days remaining',
    today: 'Today',
    postType: 'Posts',
    seeMore: 'See more',
    whereShouldWeGo: '🚌 Travel categories',
    bookTourWithOther: 'Group booking',
    travelWithReasonablePrice: 'Travel with the most reasonable price 😯🥳',
    travelReview: 'Review travel',
    letCreateCommunity: "Let's create a trust travel community 🙌",
    topGroupBooking: '🤟 Top group booking',
    discovery: '✈️ Discovery',
    resultFor: 'Result for',
    averageStars: 'Average stars: {{value}}',
    totalReviews: 'Total reviews: {{value}}',
    totalCampaigns: 'Total group booking campaigns: {{value}}',
    goodMorning: 'Good morning 🌤',
    goodAfternoon: 'Good afternoon ☀️',
    goodEvening: 'Good evening 🌙',
    thanksForJoin: 'Thanks for joining with us ❤️',
    amountBookGb: 'Quantities orders: {{value}}',
    depositAmount: 'Deposit amount: {{value}}vnd',
    titleDeposit: 'You need to deposit a small amount',
    theMoneyIs: 'The money deposit is: ',
    goToDeposit: 'Go to deposit',
    hotLocation: '🔥 Hot location',
    travelCamping: 'Experience travel',
    travelVolunteer: 'Volunteer',
    travelTeamBuilding: 'Team building',
    travelFood: 'Food tour',
    travelCulture: 'Culture travel',
    travelGreen: 'Green travel',
    travelSightSeeing: 'Sightseeing',
    travelAll: 'All',
    searchAround: 'Search people or destination',
    category: 'Categories ({{value}})',
    available: 'Available',
    temporarilyClosed: 'Temporarily closed',
    notWorry:
        "Dont't worry.\nStore just is only temporarily not accepting any more orders\nYour booking is still being processed.",
    closed: 'Closed',
    amount: 'Amount:',
    noteForMerchant: 'Note for merchant',
    arrivalTime: 'Arrival time:',
    note: 'Note: ',
    numberRetailTurns: '{{value}} buying separately turns',
    addPhoneNumber: 'Add phone number',
    openAvailable: 'Open receiving booking',
    reviewUpdatePrice: 'Reviewing update prices',
    cancelRequest: 'Cancel requesting',
    historyEdit: 'Editing history',
    viewReply: 'View replies ({{value}})',
    hide: 'Hide',
};

// REPUTATION
const reputation = {
    community: 'Community',
    topReviewer: 'Top reviewers',
    yourRank: 'Your rank: {{value}}',
    reviewCommunity: 'Review community',
    experience: 'Experience',
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Chats',
        requestPublic:
            'Do you agree to unlock anonymous of this conversation?\n\nAfter unlocking, you and this friend can know and follow each other!',
        waitingOther: 'Waiting response from\nyour friend...',
        areYouReady: 'Are you ready? :D',
        congratulation:
            'Congratulation! :D\nNow you can connect and make friend to each other',
    },
    detailSetting: {
        title: 'Chat details',
        profile: "{{name}}'s profile",
        conversationName: 'Conversation name',
        theme: 'Theme',
        stopConversation: 'Stop chat',
        openConversation: 'Open chat',
        block: 'Block',
        report: 'Report',
    },
    typing: 'typing',
    hadJoinGroup: 'had joined group',
    changeColorOfChat: ' had changed color of chat',
    changeNameOfChat: ' had changed name of chat',
    editConversationName: 'Conversation name',
    oneNameForBoth: 'Use one name for both of you',
};

// PROFILE ROUTE
const profile = {
    title: 'Profile',
    component: {
        infoProfile: {
            follower: 'Followers',
            following: 'Following',
            introduce:
                'Sign up for more chat enjoy and make your own profile !',
            tellSignUp: 'Go to sign up',
            editProfile: 'Edit profile',
        },
        searchAndSetting: 'Finding others',
    },
    edit: {
        confirmButton: 'Update',
        name: 'Your name',
        anonymousName: 'Anonymous name',
    },
    screen: {
        sendMessage: 'Send message',
        follow: 'Follow',
        unFollow: 'Unfollow',
        goToChatTag: 'Go to conversation',
        confirmDeleteGroup:
            "After deleting, people won't see and join your group\nAre you sure delete?",
    },
    modalize: {
        setting: 'Setting',
        myInfo: 'My information',
        block: 'Block',
        report: 'Report',
    },
    post: {
        title: 'Post your image',
        caption: 'Write caption',
        post: 'Post',
        draft: 'Draft',
        edit: 'Edit',
        archive: 'Archive',
        unArchive: 'Show on profile',
        delete: 'Delete',
        sureDeletePost: 'Are you sure delete this post?',
        enterTopic: 'Enter topic yourself',
        pickImage: 'Pick images',
        addLink: 'Add link',
        feeling: 'Feeling',
        checkIn: 'Check in',
        topic: 'Topic',
        rating: 'Rating',
        pasteLink: 'Paste link here',
        whereAreYouNow: "Where're you now?",
        willDebutSearchOnGoogleMap:
            "Doffy're developing searching on Google map\nLet's wait for us",
        nice: 'Nice',
        cute: 'Cute',
        wondering: 'Wondering',
        cry: 'Cry',
        angry: 'Angry',
        travel: 'Travel',
        cuisine: 'Cuisine',
        shopping: 'Shopping',
    },
    follow: {
        follower: 'Followers',
        following: 'Followings',
        follow: 'Follow',
    },
    removeAvatar: 'Remove avatar',
    draftPost: 'Draft',
    thisPostInDraft: 'This post is in draft',
    goToPost: 'Go to post',
    reviewProvider: 'Write review',
    postsArchived: 'Post archived',
    upgradeAccount: 'Supplier account',
    gotToCreateGb: 'Create first group buying campaign',
    createReviewPost: 'Review post',
    createGroupBuying: 'Group booking campaign',
    subscriptionDeadline: 'Subscription deadline',
    startDate: 'Start date',
    endDate: 'End date',
    addPrice: 'Add price',
    editPrice: 'Edit prices',
    number: 'Number',
    price: 'Price',
    toBecomeShopAccount:
        'In order to become touring supplier\nWe need some information to complete review process',
    firstEnterLocation: "First, let's us know your location",
    location: 'Location',
    bank: 'Choose bank',
    bankName: 'Bank',
    accountNumber: 'Account number',
    byTapping: 'By tapping ',
    agreeSendTheseInformation:
        ", you agree to send these information to us.\nReviewing process can take some time, we'll notice to you within 24 hours via email ",
    phoneNumber: 'Your phone number',
    requestUpgradeSuccess: 'Send request successfully',
    description: 'Description about you',
    shop: 'Shop',
    favorite: 'Favorite',
    rating: 'Rating',
    joining: 'Joining',
    joinedSuccess: 'Joined successfully',
    gbOrder: 'Group booking orders',
    editProfile: 'Edit profile',
    maxGroups: 'Maximum number of groups',
    sendRequestChangePrice: 'Request changing prices',
    updateBankAccount: 'Receiving account',
};

// SETTING ROUTE
const setting = {
    component: {
        typeMainSetting: {
            security: 'Security and login',
            personalInfo: 'Personal information',
            aboutFindme: 'About us',
            extend: 'Extend setting',
            logOut: 'Log out',
        },
    },
    settingScreen: {
        headerTitle: 'Setting',
    },
    securityAndLogin: {
        headerTitle: 'Security and login',
        nowPass: 'Current password',
        newPass: 'New password',
        confirmPass: 'Confirm password',
        buttonChangePass: 'Confirm',
        changePass: 'Change password',
        userBlocked: 'User blocked',
        lockAccount: 'Lock my account',
        areYouSureLockAccount:
            'Are you sure to lock your account?\nAfter locking, all information on your profile will not be visible to anyone, and people will not be able to message you anymore.\n\nYou can open your account by logging in again.',
        continueLock: 'Continue locking',
        deleteAccount: 'Delete my account',
        areYouSureDeleteAccount:
            'Are you sure to delete your account?\nAfter tapping Continue deleting, your account will be temporarily locked for 20 days, you can still reactivate your account during the above time.\n\nOtherwise, after the above time, all your information including email, personal information will be deleted from our system.',
        continueDelete: 'Continue deleting',
    },
    personalInfo: {
        headerTitle: 'Personal information',
        enterPassword: 'Enter password',
        password: 'Password',
        notYet: 'Not yet',
        alertCfChange: 'Are you sure want to change this information?',
        confirm: 'Confirm',
        passwordNotTrue: 'Password not true !',
        editEmail: 'Edit email',
        editPhone: 'Edit phone number',
    },
    extendSetting: {
        headerTitle: 'Extend setting',
        theme: 'Theme',
        language: 'Language',
    },
    aboutUs: {
        headerTitle: 'About us',
        privacyPolicy: 'Privacy Policy',
        termsOfUse: 'Terms of use',
        contactUs: 'Contact us',
        feedback: 'Feedback box',
    },
    userGuide: {
        title: 'User guide',
    },
    updateStatus: 'Update status',
};

// NOTIFICATION
const notification = {
    title: 'Notifications',
    comment: ' commented on your post',
    follow: ' start following you',
    likePost: ' liked your post',
    friendPostNew: ' post new post',
    likeGroupBuying: '  like your group buying campaign',
};

// ALERT
const alert = {
    // FOR LOGIN
    notNull: 'This is a required field !',
    passConfirmFalse: 'Password confirm is false !',
    wantToSave: 'Do you want to save account for login later?',
    loginFail: 'Login Fail',
    wantToChange: 'Want to change ?',

    // FOR DISCOVERY
    clickHeartModeExp: 'Finding hobby chat is only used when you logged in !',
    clickPlusModeExp: 'Create bubble chat only used when you logged in !',
    moreButtonContent: 'Go to Sign up',
    needToAddPhone: 'You need to add phone number\nin order to join services',
    phoneExisted: 'This phone have been used by one other',

    // FOR SETTING
    nowPassError: 'Current password not true !',
    successChangePass: 'Changed password successful !',
    successChange: 'Changed successfully !',

    // STYLE INPUT FORM
    notWrapProvider: 'You must wrap provider in this form',
    require: 'This is a required field',
    minLength: 'Please enter from {{min}} to {{max}} characters',
    regexPass: 'Can only contain characters and numbers',
    passNotMatch: 'Password not match',
    inValidEmail: 'Invalid email',
    inValidPhone: 'Invalid phone number',

    // PROFILE
    successUpdatePro: 'Update profile successful !',
    invalidLink: 'Invalid link',
    numberPeopleMoreThan: 'Number people have to be more than {{value}}',
    numberPeopleLessThan: 'Number people have to be less than {{value}}',
    numberPeopleMoreAndLess:
        'Number people have to be more than {{start}} and less than {{end}}',
    priceLessThan: 'Price have to be less than {{value}}',
    priceMoreThan: 'Price have to be more than {{value}}',
    priceMoreLessThan:
        'Price have to be more than {{start}} and less than {{end}}',
    deadlineDateBefore:
        'Joining deadline has to be before starting date: {{value}}',
    canNotEditStartTimeAndPrice: 'You can not edit start time and prices',
    canChooseMaximum3: 'You can only choose maximum 3 topics',
    requestDeleteGbSuccess:
        'Send request delete successfully.\nWe will review and return the result within 24 hours.\nYou can cancel this request by press "Update status", then Open receiving booking.',
    ifUpdatePrice:
        'We will review your prices change request within 24 hours.\nAlso, to protect the interests of who have deposited at the old price, people can also view your prices edit schedule.',
    sureUpdateBankAccount: 'Are you sure want to update your bank account?',

    // PERMISSION
    permissionCamera: 'Access camera',
    permissionMicro: 'Access microphone',
    permissionPhoto: 'Access photo library',
};

const en = {
    common,
    alert,
    login,
    discovery,
    mess,
    profile,
    setting,
    notification,
    reputation,
};

export default en;
