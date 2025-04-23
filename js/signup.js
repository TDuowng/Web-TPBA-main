document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const message = document.getElementById('message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Kiểm tra dữ liệu đầu vào
        if (password !== confirmPassword) {
            showMessage('Mật khẩu xác nhận không khớp!', 'red');
            return;
        }

        // Lấy danh sách người dùng từ localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Kiểm tra email hoặc username đã tồn tại
        if (users.some(user => user.email === email)) {
            showMessage('Email đã được sử dụng!', 'red');
            return;
        }
        if (users.some(user => user.username === username)) {
            showMessage('Tên tài khoản đã được sử dụng!', 'red');
            return;
        }
        if (users.some(user => user.phone === phone)) {
            showMessage('Số điện thoại đã được sử dụng!', 'red');
            return;
        }

        // Tạo user mới
        const newUser = {
            name,
            email,
            username,
            phone,
            password, // Lưu ý: Trong thực tế, mật khẩu cần mã hóa
            role: 'customer'
        };

        // Lưu vào localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Hiển thị thông báo thành công và chuyển hướng
        showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'green');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    function showMessage(text, color) {
        message.textContent = text;
        message.style.color = color;
        message.style.display = 'block';
    }
});