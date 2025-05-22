// تهيئة SDK الفيسبوك
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v17.0'
    });
};

// التحقق من تسجيل الدخول
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    displayUserData(userData);
    
    if (userData.type === 'facebook') {
        loadFacebookData(userData.id);
    }
}

// تحميل بيانات الفيسبوك
function loadFacebookData(userId) {
    FB.api(
        `/${userId}`,
        'GET',
        {"fields": "id,name,email,picture,cover,location,friends.limit(0).summary(true),posts.limit(0).summary(true),photos.limit(0).summary(true)"},
        function(response) {
            if (response && !response.error) {
                updateFacebookStats(response);
                updateFacebookProfile(response);
            }
        }
    );
}

// تحديث إحصائيات الفيسبوك
function updateFacebookStats(data) {
    if (data.posts && data.posts.summary) {
        document.getElementById('posts-count').textContent = data.posts.summary.total_count;
    }
    
    if (data.friends && data.friends.summary) {
        document.getElementById('friends-count').textContent = data.friends.summary.total_count;
    }
    
    if (data.photos && data.photos.summary) {
        document.getElementById('photos-count').textContent = data.photos.summary.total_count;
    }
    
    if (data.location) {
        document.getElementById('location-item').style.display = 'flex';
        document.getElementById('profile-location').textContent = data.location.name;
    }
    
    if (data.cover) {
        document.getElementById('cover-photo').style.backgroundImage = `url(${data.cover.source})`;
        document.getElementById('cover-photo').style.backgroundSize = 'cover';
        document.getElementById('cover-photo').style.backgroundPosition = 'center';
    }
}

// تحديث ملف الفيسبوك
function updateFacebookProfile(data) {
    document.getElementById('facebook-profile').style.display = 'block';
    
    const fbPageContainer = document.getElementById('fb-page-container');
    fbPageContainer.setAttribute('data-href', `https://www.facebook.com/${data.id}`);
    
    if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
    }
}

// عرض بيانات المستخدم
function displayUserData(userData) {
    // عرض الصورة الشخصية
    const profilePicture = document.getElementById('profile-picture');
    if (userData.picture) {
        if (typeof userData.picture === 'string') {
            profilePicture.src = userData.picture;
        } else if (userData.picture.data && userData.picture.data.url) {
            profilePicture.src = userData.picture.data.url;
        }
    }
    
    // عرض الاسم
    document.getElementById('profile-name').textContent = userData.name;
    
    // عرض البريد الإلكتروني
    document.getElementById('profile-email').textContent = userData.email;
    
    // عرض نوع الحساب
    document.getElementById('account-type').textContent = userData.type === 'facebook' ? 'فيسبوك' : 'بريد إلكتروني';
    
    // عرض تاريخ التسجيل
    const date = new Date(userData.registrationDate);
    document.getElementById('registration-date').textContent = date.toLocaleDateString('ar-EG');
    
    // تحديث حالة الملف الشخصي
    if (userData.type === 'facebook') {
        document.getElementById('profile-status').textContent = 'متصل بحساب فيسبوك';
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// التحقق من تسجيل الدخول عند تحميل الصفحة
window.onload = checkAuth;
