const common = {
    yes: 'Có',
    no: 'Không',
    imageUpload: {
        selected: 'Chọn',
        cancel: 'Huỷ',
    },
    // option image picker
    chooseFromLibrary: 'Chọn từ thư viện',
    chooseFromCamera: 'Chụp ảnh',
    cancel: 'Huỷ',
    next: 'Tiếp',
    done: 'Xong',
    save: 'Lưu',
    canNotSave: 'Không thể lưu',
    success: 'Thành công',
    seeMore: '...Xem thêm',
    seeLess: '...Ẩn bớt',
    letGo: 'Đi thôi',
    continue: 'Tiếp tục',
    reply: 'Trả lời',
    anonymous: '@Ẩn danh',
    writeSomething: 'Nội dung',
    discard: 'Bỏ đi',
    stay: 'Ở lại',
    wantToDiscard: 'Bạn muốn bỏ những thay đổi vừa rồi?',
    null: '',
    search: 'Tìm kiếm',
    change: 'Thay đổi',
};

const login = {
    component: {
        sendOTP: {
            header: 'Xác nhận OTP',
            enterCode: 'Nhập mã',
            confirmButton: 'Xác nhận',
            sendAgain: 'Gửi lại ({{countdown}})',
            sendAgainNoCount: 'Gửi lại',
            notiOTP: 'Vui lòng nhập mã xác minh Doffy đã gửi đến',
        },
    },
    forgetPassword: {
        type: {
            header: 'Quên mật khẩu',
            chooseMethod: 'Chọn cách thức khôi phục mật khẩu',
            user: 'Tên đăng nhập',
            username: 'Nhập email của bạn',
            continue: 'Tiếp tục',
            comeToFacebook: 'Đi tới facebook',
        },
        send: {
            header: 'Quên mật khẩu',
            receiveThrow: 'Nhận OTP qua',
            phone: 'Số điện thoại',
        },
        form: {
            header: 'Đặt lại mật khẩu',
            newPass: 'Mật khẩu mới',
            confirmPass: 'Xác nhận mật khẩu',
            buttonDone: 'Đã xong',
        },
    },
    signUp: {
        type: {
            header: 'Đăng ký',
            chooseMethod: 'Chọn cách thức đăng ký tài khoản',
            phone: 'Số điện thoại',
            nameHolder: 'Tên Findme',
        },
        form: {
            header: 'Đăng ký',
            username: 'Tên đăng nhập',
            password: 'Mật khẩu',
            confirmPass: 'Xác nhận mật khẩu',
            confirmButton: 'Xác nhận',
            enterEmail: 'Email',
            enterPhone: 'Số điện thoại',
        },
        hadReadAndAgree: 'Tôi đã đọc và đồng ý với',
        doffyTermsAndPolicy: 'Điều khoản sử dụng',
    },
    detailInformation: {
        title: 'Thông tin cá nhân',
        man: 'Nam',
        woman: 'Nữ',
        notToSay: 'Không tiện nói',
        firstChooseGender: 'Đầu tiên, chọn giới tính của bạn',
        enterYourName: 'Nhập tên của bạn:',
        chooseBirthday: 'Chọn ngày sinh',
    },
    loginScreen: {
        slogan: 'Trò chuyện và tìm những người bạn thú vị',
        username: 'Email',
        password: 'Mật khẩu',
        keepSignIn: 'Duy trì đăng nhập',
        signIn: 'Đăng nhập',
        byLoginOrTappingEnjoy:
            'Bằng việc đăng nhập hoặc sử dụng "Trải nghiệm không tài khoản", bạn đồng ý với',
        termsOfUse: 'Điều khoản sử dụng',
        learnMore:
            ' của chúng tôi. Hiểu về cách chúng tôi xử lý dữ liệu của bạn tại',
        privacyPolicy: 'Chính sách bảo mật',
        yourAccountIsBeingLock:
            'Tài khoản của bạn đang khoá tạm thời.\nBằng việc ấn Tiếp tục, bạn xác nhận mở khoá tài khoản của mình.',
        continue: 'Tiếp tục',
        openAccountSuccess: 'Mở khoá tài khoản thành công!',
    },
    agreeTermOfService: {
        registerSuccess: 'Đăng ký thành công',
        agreeTermOfService: 'Đi thôi',
        contentSuggest:
            'Đăng ký thành công! 🥰\nBây giờ chúng ta hãy bắt đầu chỉnh sửa hồ sơ của bạn',
    },
    enjoy: 'Trải nghiệm',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    enjoyModeNoAcc: 'Trải nghiệm app không dùng tài khoản',
    forgotPassword: 'Quên mật khẩu?',
    orSignIn: 'Đăng nhập với:',
};

// DISCOVERY ROUTE
const discovery = {
    home: 'Trang chủ',
    bubble: {
        goToSignUp:
            'Đi tới đăng nhập để có thể bắt đầu trò chuyện với mọi người nhé',
        joinCommunity: 'Tham gia nhóm',
    },
    report: {
        title: 'Tố cáo',
        reportPerson: 'Tố cáo {{name}}',
        chooseReason: '※ Chọn một lý do để tố cáo người dùng này:',
        offensiveLanguage: 'Ngôn từ tục tĩu, gây xúc phạm',
        dangerousAction: 'Hành vi nguy hiểm, đe doạ tới tôi hoặc mọi người',
        spamRuining: 'Liên tục spam, ảnh hưởng tới trải nghiệm cá nhân',
        insultToMe: 'Bôi nhọ danh dự cá nhân người khác',
        otherReason: 'Khác',
        detailDescription: 'Mô tả chi tiết:',
        uploadImage: 'Nếu có thể, hãy gửi cho chúng tôi một số hình ảnh',
        sendReport: 'Gửi tố cáo',
        reportHadSent:
            'Tố cáo của bạn đã được gửi đi\nChúng tôi sẽ xem xét đối với tố cáo của bạn và người dùng bị tố cáo để có những biện pháp xử lý kịp thời\n\nCám ơn bạn đã chung tay vì một cộng đồng Doffy ngày càng tốt hơn\n\nTrân trọng!\nDoffy Co.',
    },
    seeDetailImage: 'Xem ảnh',
    share: {
        title: 'Chia sẻ',
    },
    all: 'Tất cả',
    like: 'Thích',
    numberLike: '{{value}} thích',
    comment: 'Bình luận',
    numberComments: '{{numberComments}} bình luận',
    chooseTopic: 'Loại hình du lịch',
    applicationPeriod: 'Thời gian áp dụng',
    retailPrice: 'Giá mua riêng',
    groupBuyingPrice: 'Bảng giá mua chung',
    numberPeople: '{{value}} người',
    joinNow: 'Tham gia ngay',
    joinGroupBuying: 'Mua theo nhóm',
    buySeparately: 'Mua riêng',
    continueJoin: 'Tiếp tục tham gia',
    joined: 'Đã tham gia',
    deposited: 'Đã đặt cọc',
    numberGroupJoined: '{{value}} nhóm đã tham gia',
    beTheFirstJoin: 'Hãy là người đầu tiên tham gia nào',
    bought: 'Thanh toán đủ',
    confirmBought: 'Xác nhận thanh toán đủ',
    participators: '{{value}} người tham gia',
    gbExpired: 'Cửa hàng tạm thời không nhận thêm order',
    reviewAbout: 'Bạn đang viết review về ',
    goToProfile: 'Xem trang cá nhân',
    openLink: 'Mở đường dẫn',
    dayRemain: '{{value}} ngày còn lại',
    today: 'Hôm nay',
    postType: 'Bài đăng',
    seeMore: 'Xem thêm',
    whereShouldWeGo: '🚌 Loại hình du lịch',
    bookTourWithOther: 'Đặt tour nhóm',
    travelWithReasonablePrice: 'Đi du lịch với giá ưu đãi nhất 😯🥳',
    travelReview: 'Review trải nghiệm',
    letCreateCommunity:
        'Cùng chúng tôi tạo lên một cộng đồng du lịch chân thực 🙌',
    topGroupBooking: '🤟 Top đơn mua chung',
    discovery: '✈️ Khám phá',
    resultFor: 'Kết quả cho',
    averageStars: ' Số sao trung bình: {{value}}',
    totalReviews: ' Số bài review: {{value}}',
    totalCampaigns: ' Số chiến dịch mua chung: {{value}}',
    goodMorning: 'Chào buổi sáng 🌤',
    goodAfternoon: 'Chào buổi chiều ☀️',
    goodEvening: 'Chào buổi tối 🌙',
    thanksForJoin: 'Cảm ơn bạn đã tham gia cùng chúng mình ❤️',
    amountBookGb: 'Số lượng mua: {{value}}',
    depositAmount: 'Số tiền đặt cọc: {{value}}vnd',
    titleDeposit: 'Bạn cần đặt cọc một khoản tiền cho người bán',
    theMoneyIs: 'Số tiền đặt cọc là: ',
    goToDeposit: 'Đi tới đặt cọc',
    hotLocation: '🔥 Địa điểm hot',
    travelCamping: 'Trải nghiệm',
    travelVolunteer: 'Tình nguyện',
    travelTeamBuilding: 'Team building',
    travelFood: 'Food tour',
    travelCulture: 'Du lịch văn hoá',
    travelGreen: 'Du lịch xanh',
    travelSightSeeing: 'Tham quan',
    travelAll: 'Tất cả',
    searchAround: 'Tìm kiếm mọi người hoặc nơi đến',
    category: 'Loại hình ({{value}})',
    available: 'Có sẵn',
    temporarilyClosed: 'Tạm dừng nhận đơn',
    notWorry:
        'Đừng lo lắng.\nCửa hàng chỉ tạm thời không nhận thêm order nữa\nĐơn đặt hàng của bạn vẫn tiếp tục được tiến hành.',
    closed: 'Đã kết thúc',
    amount: 'Số lượng:',
    noteForMerchant: 'Ghi chú cho người bán',
    arrivalTime: 'Thời gian đến:',
    note: 'Ghi chú: ',
    numberRetailTurns: '{{value}} lượt mua riêng',
    addPhoneNumber: 'Thêm số điện thoại',
    openAvailable: 'Mở nhận đặt đơn',
    reviewUpdatePrice: 'Đang duyệt cập nhật giá',
    cancelRequest: 'Huỷ yêu cầu',
    historyEdit: 'Lịch sử chỉnh sửa',
    viewReply: 'Phản hồi ({{value}})',
    hide: 'Ẩn',
};

// REPUTATION
const reputation = {
    community: 'Cộng đồng',
    topReviewer: 'Top reviewers',
    yourRank: 'Thứ hạng của bạn: {{value}}',
    reviewCommunity: 'Cộng đồng review',
    experience: 'Trải nghiệm',
};

// PROFILE SCREEN
const profile = {
    title: 'Cá nhân',
    component: {
        infoProfile: {
            follower: 'Người theo dõi',
            following: 'Đang theo dõi',
            introduce:
                'Đăng ký tài khoản để trải nghiệm các năng chat và tạo trang cá nhân của riêng mình nhé !',
            tellSignUp: 'Đi tới đăng ký',
            editProfile: 'Chỉnh sửa trang cá nhân',
        },
        searchAndSetting: 'Tìm những người khác',
    },
    edit: {
        confirmButton: 'Cập nhật',
        name: 'Tên hiển thị',
        anonymousName: 'Tên ẩn danh',
    },
    screen: {
        sendMessage: 'Gửi tin nhắn',
        follow: 'Theo dõi',
        unFollow: 'Huỷ theo dõi',
        goToChatTag: 'Đi tới cuộc trò chuyện',
        confirmDeleteGroup:
            'Sau khi xoá, mọi người sẽ không thấy và tham gia nhóm của bạn nữa\nBạn vẫn chắc chắn xoá chứ?',
    },
    modalize: {
        setting: 'Cài đặt',
        myInfo: 'Thông tin của tôi',
        block: 'Chặn',
        report: 'Tố cáo',
    },
    post: {
        title: 'Đăng ảnh',
        caption: 'Cảm nghĩ',
        post: 'Tải lên',
        draft: 'Lưu nháp',
        edit: 'Chỉnh sửa',
        archive: 'Tạm ẩn',
        unArchive: 'Hiện lại bảng tin',
        delete: 'Xoá',
        sureDeletePost: 'Bạn chắc chắn muốn xoá\nbài đăng này chứ?',
        enterTopic: 'Tự nhập chủ đề',
        pickImage: 'Chọn ảnh',
        addLink: 'Thêm link',
        feeling: 'Cảm xúc',
        checkIn: 'Check in',
        topic: 'Chủ đề',
        rating: 'Đánh giá',
        pasteLink: 'Dán đường dẫn URL',
        whereAreYouNow: 'Bạn đang ở đâu?',
        willDebutSearchOnGoogleMap:
            'Doffy đang phát triển tính năng tìm địa chỉ trên Google map\nBạn đợi xíu nha',
        nice: 'Tốt',
        cute: 'Cute',
        wondering: 'Phân vân',
        cry: 'Khóc',
        angry: 'Tức giận',
        travel: 'Du lịch',
        cuisine: 'Ẩm thực',
        shopping: 'Mua sắm',
    },
    follow: {
        follower: 'Người theo dõi',
        following: 'Đang theo dõi',
        follow: 'Theo dõi',
    },
    removeAvatar: 'Xoá ảnh',
    draftPost: 'Bài nháp',
    thisPostInDraft: 'Bạn đang lưu nháp bài này',
    goToPost: 'Đi tới đăng bài',
    reviewProvider: 'Viết review',
    postsArchived: 'Bài viết lưu trữ',
    upgradeAccount: 'Chế độ nhà cung cấp',
    gotToCreateGb: 'Tạo chiến dịch mua chung đầu tiên',
    createReviewPost: 'Bài review',
    createGroupBuying: 'Chiến dịch mua chung',
    subscriptionDeadline: 'Thời hạn đăng ký',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    addPrice: 'Thêm giá',
    editPrice: 'Sửa giá',
    number: 'Số lượng',
    price: 'Giá',
    toBecomeShopAccount:
        'Để trở thành một nhà cung cấp tour\ndu lịch\nChúng tôi cần một số thông tin phục vụ cho quá trình xét duyệt',
    firstEnterLocation: 'Đầu tiên, hãy cho chúng tôi biết địa chỉ của bạn',
    location: 'Địa chỉ',
    bank: 'Chọn ngân hàng',
    bankName: 'Ngân hàng',
    accountNumber: 'Số tài khoản',
    byTapping: 'Bằng việc ấn ',
    agreeSendTheseInformation:
        ', bạn đồng ý gửi các thông tin trên cho chúng tôi.\nQuá trình xét duyệt có thể mất chút thời gian, chúng tôi sẽ thông báo tới bạn qua địa chỉ email ',
    phoneNumber: 'Số điện thoại của bạn',
    requestUpgradeSuccess: 'Gửi yêu cầu thành công',
    description: 'Mô tả về bạn',
    shop: 'Shop',
    favorite: 'Yêu thích',
    rating: 'Đánh giá',
    joining: 'Đang tham gia',
    joinedSuccess: 'Tham gia thành công',
    gbOrder: 'Đơn mua chung',
    editProfile: 'Chỉnh sửa',
    maxGroups: 'Số lượng nhóm tối đa',
    sendRequestChangePrice: 'Yêu cầu thay đổi giá',
    updateBankAccount: 'Tài khoản nhận tiền',
};

// MESS ROUTE
const mess = {
    component: {},
    messScreen: {
        headerTitle: 'Tin nhắn',
        requestPublic:
            'Bạn đồng ý mở khóa ẩn danh của cuộc trò chuyện này chứ?\n\nSau khi mở khoá, bạn và người bạn này có thể biết và theo dõi với nhau!',
        waitingOther: 'Đợi phản hồi từ người bạn bên kia...',
        areYouReady: 'Sẵn sàng chưa? :D',
        congratulation:
            'Wowww! :D\nGiờ đây các bạn có thể chia sẻ và kết bạn với nhau rồi',
    },
    detailSetting: {
        title: 'Chi tiết trò chuyện',
        profile: 'Trang cá nhân của {{name}}',
        theme: 'Màu sắc',
        conversationName: 'Tên cuộc trò chuyện',
        stopConversation: 'Dừng chat',
        openConversation: 'Mở chat',
        block: 'Chặn',
        report: 'Tố cáo',
    },
    typing: 'typing',
    hadJoinGroup: 'vừa tham gia nhóm',
    changeColorOfChat: '{{name}} đã thay đổi màu sắc cuộc trò chuyện',
    changeNameOfChat: '{{name}} đã thay đổi tên cuộc trò chuyện',
    editConversationName: 'Tên cuộc trò chuyện',
    oneNameForBoth: 'Sử dụng một tên cho cả hai bạn',
};

// SETTING ROUTE
const setting = {
    component: {
        typeMainSetting: {
            security: 'Bảo mật và đăng nhập',
            personalInfo: 'Thông tin cá nhân',
            aboutFindme: 'Về chúng tôi',
            extend: 'Cài đặt mở rộng',
            logOut: 'Đăng xuất',
        },
    },
    settingScreen: {
        headerTitle: 'Cài đặt',
    },
    securityAndLogin: {
        headerTitle: 'Bảo mật và đăng nhập',
        nowPass: 'Mật khẩu hiện tại',
        newPass: 'Mật khẩu mới',
        confirmPass: 'Xác nhận mật khẩu',
        buttonChangePass: 'Xác nhận',
        changePass: 'Thay đổi mật khẩu',
        userBlocked: 'Chặn người dùng',
        lockAccount: 'Khoá tài khoản',
        areYouSureLockAccount:
            'Bạn chắc chắn khoá tài khoản của mình chứ?\nSau khi khoá, mọi thông tin trên trang cá nhân của bạn sẽ không hiển thị với bất cứ ai, mọi người cũng không thể nhắn tin với bạn nữa.\n\nBạn có thể mở khoá tài khoản của mình bằng cách đăng nhập lại.',
        continueLock: 'Tiếp tục khoá',
        deleteAccount: 'Xoá tài khoản',
        areYouSureDeleteAccount:
            'Bạn chắc chắn muốn xoá tài khoản của mình chứ?\nSau khi ấn Tiếp tục xoá, tài khoản của bạn sẽ tạm thời bị khóa trong vòng 20 ngày, bạn vẫn có thể tái kích hoạt tài khoản của mình trong thời gian trên.\n\nNếu không, sau thời gian trên, tất cả thông tin của bạn bao gồm email, thông tin cá nhân sẽ bị xóa khỏi hệ thống.',
        continueDelete: 'Tiếp tục xoá',
    },
    personalInfo: {
        headerTitle: 'Thông tin cá nhân',
        enterPassword: 'Nhập mật khẩu',
        password: 'Mậu khẩu',
        notYet: 'Chưa có',
        alertCfChange:
            'Bạn chắc chắn muốn thay đổi thông tin này của mình chứ?',
        confirm: 'Xác nhận',
        passwordNotTrue: 'Mật khẩu không đúng !',
        editEmail: 'Chỉnh sửa email',
        editPhone: 'Sửa số điện thoại',
    },
    extendSetting: {
        headerTitle: 'Cài đặt mở rộng',
        theme: 'Giao diện',
        language: 'Ngôn ngữ',
    },
    aboutUs: {
        headerTitle: 'Về chúng tôi',
        privacyPolicy: 'Chính sách bảo mật',
        termsOfUse: 'Điều khoản sử dụng',
        contactUs: 'Liên hệ chúng tôi',
        feedback: 'Hòm thư góp ý',
    },
    userGuide: {
        title: 'Hướng dẫn sử dụng',
    },
    updateStatus: 'Cập nhật trạng thái',
};

// NOTIFICATION
const notification = {
    title: 'Thông báo',
    comment: ' đã bình luận bài của bạn',
    follow: ' bắt đầu theo dõi bạn',
    likePost: ' thích bài đăng của bạn',
    friendPostNew: ' vừa đăng một bài mới',
    likeGroupBuying: '  thích chiến dịch mua chung của bạn',
};

// ALERT
const alert = {
    // FOR LOGIN
    notNull: 'Giá trị không được để trống !',
    passConfirmFalse: 'Mật khẩu xác nhận\nkhông đúng !',
    wantToSave: 'Bạn muốn giữ trạng thái đăng nhập cho lần sau chứ?',
    loginFail: 'Đăng nhập thất bại',
    wantToChange: 'Xác nhận thay đổi',

    // FOR DISCOVERY
    clickHeartModeExp:
        'Tìm sở thích chat chỉ có thể sử dụng khi đăng nhập tài khoản !',
    clickPlusModeExp:
        'Tạo bong bóng chat chỉ có thể sử dụng khi đăng nhập tài khoản !',
    moreButtonContent: 'Đi tới đăng ký',
    needToAddPhone: 'Bạn cần thêm số điện thoại\nđể tham gia các dịch vụ',
    phoneExisted: 'Số điện thoại đã được một người khác sử dụng',

    // FOR SETTING
    nowPassError: 'Mật khẩu hiện tại không đúng !',
    successChangePass: 'Thay đổi mật khẩu thành công !',
    successChange: 'Thay đổi thành công !',

    // STYLE INPUT FORM
    notWrapProvider: 'You must wrap provider in this form',
    require: 'Giá trị bắt buộc điền',
    minLength: 'Chỉ nhập từ {{min}} tới {{max}} ký tự',
    regexPass: 'Chỉ bao gồm chữ cái và số',
    passNotMatch: 'Mật khẩu không trùng khớp',
    inValidEmail: 'Email không đúng định dạng',
    inValidPhone: 'Số điện thoại không đúng',

    // PROFILE
    successUpdatePro: 'Cập nhật trang cá nhân thành công !',
    invalidLink: 'Đường dẫn URL không hợp lệ',
    numberPeopleMoreThan: 'Số lượng người phải nhiều hơn {{value}}',
    numberPeopleLessThan: 'Số lượng người phải ít hơn {{value}}',
    numberPeopleMoreAndLess:
        'Số lượng người phải nhiều hơn {{start}} và ít hơn {{end}}',
    priceLessThan: 'Giá tiền phải ít hơn {{value}}',
    priceMoreThan: 'Giá tiền phải nhiều hơn {{value}}',
    priceMoreLessThan: 'Giá tiền phải nhiều hơn {{start}} và ít hơn {{end}}',
    deadlineDateBefore: 'Ngày hết hạn phải trước ngày bắt đầu: {{value}}',
    canNotEditStartTimeAndPrice:
        'Bạn không thể chỉnh ngày bắt đầu và giá mua chung',
    canChooseMaximum3: 'Bạn chỉ có thể chọn tối đa 3 chủ đề',
    requestDeleteGbSuccess:
        'Gửi yêu cầu xoá thành công.\nChúng tôi sẽ xét duyệt và gửi lại thông báo trong vòng 24h.\nBạn có thể huỷ yêu cầu xoá bằng việc ấn vào "Cập nhật trạng thái", sau đó Mở nhận đặt đơn.',
    ifUpdatePrice:
        'Chúng tôi sẽ xét duyệt yêu cầu thay đổi giá của bạn trong vòng 24h.\nNgoài ra, để đảm bảo quyền lợi của những người đã đặt cọc với giá cũ, mọi người cũng có thể xem lịch sửa chỉnh sửa giá của bạn.',
    sureUpdateBankAccount:
        'Bạn chắc chắn muốn cập nhật tài khoản ngân hàng của mình?',

    // PERMISSION
    permissionCamera: 'Cho phép Doffy truy cập vào máy ảnh',
    permissionMicro: 'Cho phép Doffy truy cập vào micro',
    permissionPhoto: 'Cho phép Doffy truy cập vào thư viện ảnh',
};

const vi = {
    common,
    login,
    alert,
    discovery,
    mess,
    profile,
    setting,
    notification,
    reputation,
};
export default vi;
