// --- 1. 数据模型区域 ---
// 商品列表数据，包含每个商品的ID、标题、价格、描述和图片
const products = [
    { 
        id: 1, 
        title: "复古相机（黑色限量版）", 
        price: 2999, 
        desc: "这款复古相机采用黑色磨砂质感设计，兼具经典造型和现代传感器技术。支持4K视频录制，WIFI传输，是摄影爱好者的首选。黑色机身更显专业质感，让您的每一张照片都充满艺术气息。", 
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&sat=-50&brightness=20" 
    },
    { 
        id: 2, 
        title: "无线耳机（碳纤黑）", 
        price: 899, 
        desc: "碳纤黑配色的无线耳机，采用主动降噪技术，让您静享音乐。30小时超长续航，支持快充，人体工学设计，佩戴舒适。黑色金属质感彰显低调奢华。", 
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&sat=-50&brightness=20" 
    },
    { 
        id: 3, 
        title: "智能手表（曜石黑）", 
        price: 1599, 
        desc: "曜石黑智能手表采用黑色陶瓷表壳，全天候心率监测，睡眠分析，50米防水，支持多种运动模式。黑色表盘搭配深色表带，是您健康生活与时尚穿搭的最佳伴侣。", 
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&sat=-50&brightness=20" 
    },
    { 
        id: 4, 
        title: "蓝牙音响（重低音版）", 
        price: 699, 
        desc: "360°环绕音效，震撼重低音，IPX7防水设计，适合户外聚会使用。内置5000mAh电池，可持续播放12小时。", 
        img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&sat=-50&brightness=20" 
    },
    { 
        id: 5, 
        title: "机械键盘（电竞版）", 
        price: 599, 
        desc: "RGB背光，青轴机械开关，全键无冲，专为电竞玩家设计。铝合金面板，耐用性强，提供优秀打字体验。", 
        img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&sat=-50&brightness=20" 
    },
    { 
        id: 6, 
        title: "游戏主机（旗舰版）", 
        price: 3999, 
        desc: "支持4K游戏，1TB固态硬盘，高性能显卡，畅玩3A大作。附带无线手柄和3个月游戏会员。", 
        img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&sat=-50&brightness=20" 
    }
];

// 搜索时的关键词建议列表
const searchSuggestions = [
    "相机", "耳机", "手表", "音响", "键盘", "游戏",
    "黑色", "限量版", "无线", "蓝牙", "智能", "复古",
    "电竞", "旗舰", "重低音", "机械", "4K", "防水"
];

let cart = []; // 购物车，存放选中的商品
let currentDetailId = null; // 当前正在查看的商品ID
let currentUser = null; // 当前登录的用户信息
// 从本地存储读取用户数据，没有就初始化为空数组
let users = JSON.parse(localStorage.getItem('shop_users') || '[]'); 
// 从本地存储读取订单数据，没有就初始化为空数组
let orders = JSON.parse(localStorage.getItem('shop_orders') || '[]'); 

// --- 2. 页面导航控制 ---
// 显示指定页面，隐藏其他页面
function showPage(pageId) {
    // 所有页面的ID列表
    const pages = ['home-page', 'login-page', 'register-page', 'detail-page', 'checkout-page', 'order-history-page'];
    
    // 页面滚动到顶部，平滑效果
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 遍历所有页面，只显示目标页面，隐藏其他
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (id === pageId + '-page') {
            el.classList.remove('hidden'); // 显示目标页面
        } else {
            el.classList.add('hidden'); // 隐藏其他页面
        }
    });

    // 隐藏购物车弹窗和搜索建议
    document.getElementById('cart-modal').classList.add('hidden');
    document.getElementById('search-suggestions').classList.add('hidden');

    // 如果是结算页面，渲染结算内容
    if (pageId === 'checkout') {
        renderCheckoutPage();
    }
    
    // 更新登录按钮的显示状态
    updateLoginButton();
}

// 更新登录按钮的显示内容
function updateLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    if (currentUser) {
        // 已登录：显示用户名，点击弹出退出确认
        loginBtn.innerHTML = `👤 ${currentUser.username}`;
        loginBtn.onclick = function() {
            if (confirm(`确定要退出登录吗？\n当前用户：${currentUser.username}`)) {
                currentUser = null; // 清空当前用户
                updateLoginButton(); // 刷新按钮显示
                showPage('home'); // 回到首页
            }
        };
    } else {
        // 未登录：显示"登录/注册"，点击跳转到登录页
        loginBtn.innerHTML = '登录 / 注册';
        loginBtn.onclick = function() { showPage('login'); };
    }
}

// --- 3. 搜索功能 ---
// 搜索商品的主函数
function searchProducts() {
    // 获取搜索框输入的内容（PC和移动端）
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase() : (mobileSearchInput ? mobileSearchInput.value.toLowerCase() : '');
    
    // 获取清除按钮（PC和移动端）
    const clearBtn = document.getElementById('clear-search-btn');
    const mobileClearBtn = document.getElementById('clear-mobile-search-btn');
    
    // 有关键词时显示清除按钮，否则隐藏
    if (clearBtn) clearBtn.style.display = keyword ? 'block' : 'none';
    if (mobileClearBtn) mobileClearBtn.style.display = keyword ? 'block' : 'none';
    
    // 显示搜索建议
    showSearchSuggestions(keyword);
    
    // 没有关键词时，显示所有商品
    if (!keyword.trim()) {
        clearSearchAndShowAll();
        return;
    }
    
    // 根据关键词过滤商品（标题或描述包含关键词）
    const filteredProducts = products.filter(product => {
        return product.title.toLowerCase().includes(keyword) || 
               product.desc.toLowerCase().includes(keyword);
    });
    
    // 更新页面显示搜索结果
    updateSearchResultsUI(filteredProducts, keyword);
}

// 显示搜索建议
function showSearchSuggestions(keyword) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // 没有关键词时，隐藏建议
    if (!keyword.trim()) {
        suggestionsContainer.classList.add('hidden');
        return;
    }
    
    // 过滤出包含关键词的建议，最多显示5条
    const filteredSuggestions = searchSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(keyword)
    ).slice(0, 5);
    
    // 没有匹配的建议时，隐藏
    if (filteredSuggestions.length === 0) {
        suggestionsContainer.classList.add('hidden');
        return;
    }
    
    // 生成建议的HTML内容
    let suggestionsHTML = '';
    filteredSuggestions.forEach(suggestion => {
        suggestionsHTML += `
            <div class="p-3 hover:bg-gray-100 cursor-pointer transition border-b border-gray-100 last:border-0"
                 onclick="selectSearchSuggestion('${suggestion}')">
                <div class="flex items-center">
                    <span class="text-gray-400 mr-2">🔍</span>
                    <span>${suggestion}</span>
                </div>
            </div>
        `;
    });
    
    // 显示建议列表
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.classList.remove('hidden');
}

// 选择搜索建议（点击建议项时调用）
function selectSearchSuggestion(suggestion) {
    // 获取搜索框（PC和移动端）
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    // 将选中的建议填入搜索框
    if (searchInput) searchInput.value = suggestion;
    if (mobileSearchInput) mobileSearchInput.value = suggestion;
    
    // 隐藏建议列表，执行搜索
    document.getElementById('search-suggestions').classList.add('hidden');
    searchProducts();
}

// 更新搜索结果的页面显示
function updateSearchResultsUI(filteredProducts, keyword) {
    // 获取页面元素
    const defaultHeader = document.getElementById('default-products-header');
    const searchHeader = document.getElementById('search-results-header');
    const searchKeyword = document.getElementById('search-keyword');
    const searchResultsCount = document.getElementById('search-results-count');
    const productsContainer = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filteredProducts.length === 0) {
        // 没有搜索结果时的显示
        defaultHeader.classList.add('hidden');
        searchHeader.classList.remove('hidden');
        productsContainer.classList.add('hidden');
        noResults.classList.remove('hidden');
        
        searchKeyword.textContent = `"${keyword}"`;
        searchResultsCount.textContent = `未找到与"${keyword}"相关的商品`;
    } else {
        // 有搜索结果时的显示
        defaultHeader.classList.add('hidden');
        searchHeader.classList.remove('hidden');
        productsContainer.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        searchKeyword.textContent = `"${keyword}"`;
        searchResultsCount.textContent = `找到 ${filteredProducts.length} 个相关商品`;
        
        // 处理每个商品卡片
        productCards.forEach(card => {
            const title = card.querySelector('.product-title');
            const description = card.querySelector('.product-description');
            const titleText = title.textContent;
            const descText = description.textContent;
            
            // 移除之前的高亮效果
            const regex = /<span class="highlight">(.*?)<\/span>/gi;
            title.innerHTML = title.innerHTML.replace(regex, '$1');
            description.innerHTML = description.innerHTML.replace(regex, '$1');
            
            // 给关键词添加高亮
            if (titleText.toLowerCase().includes(keyword)) {
                const highlighted = titleText.replace(
                    new RegExp(keyword, 'gi'),
                    match => `<span class="highlight">${match}</span>`
                );
                title.innerHTML = highlighted;
            }
            
            if (descText.toLowerCase().includes(keyword)) {
                const highlighted = descText.replace(
                    new RegExp(keyword, 'gi'),
                    match => `<span class="highlight">${match}</span>`
                );
                description.innerHTML = highlighted;
            }
            
            // 显示包含关键词的商品，隐藏不包含的
            const productTitle = titleText.toLowerCase();
            const productDesc = descText.toLowerCase();
            
            if (productTitle.includes(keyword) || productDesc.includes(keyword)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// 清除PC端搜索框内容
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = ''; // 清空输入
        searchInput.focus(); // 聚焦到输入框
    }
    // 重置搜索状态，显示所有商品
    clearSearchAndShowAll();
}

// 清除移动端搜索框内容
function clearMobileSearch() {
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
        mobileSearchInput.value = ''; // 清空输入
        mobileSearchInput.focus(); // 聚焦到输入框
    }
    // 重置搜索状态，显示所有商品
    clearSearchAndShowAll();
}

// 重置搜索状态，显示所有商品
function clearSearchAndShowAll() {
    // 获取页面元素
    const defaultHeader = document.getElementById('default-products-header');
    const searchHeader = document.getElementById('search-results-header');
    const productsContainer = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');
    const productCards = document.querySelectorAll('.product-card');
    const clearBtn = document.getElementById('clear-search-btn');
    const mobileClearBtn = document.getElementById('clear-mobile-search-btn');
    
    // 重置所有商品卡片（显示并移除高亮）
    productCards.forEach(card => {
        card.classList.remove('hidden'); // 显示卡片
        
        // 移除高亮效果
        const title = card.querySelector('.product-title');
        const description = card.querySelector('.product-description');
        
        const regex = /<span class="highlight">(.*?)<\/span>/gi;
        if (title) title.innerHTML = title.innerHTML.replace(regex, '$1');
        if (description) description.innerHTML = description.innerHTML.replace(regex, '$1');
    });
    
    // 更新页面显示（显示默认标题，隐藏搜索相关内容）
    defaultHeader.classList.remove('hidden');
    searchHeader.classList.add('hidden');
    productsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    // 隐藏清除按钮
    if (clearBtn) clearBtn.style.display = 'none';
    if (mobileClearBtn) mobileClearBtn.style.display = 'none';
    
    // 隐藏搜索建议
    document.getElementById('search-suggestions').classList.add('hidden');
}

// 展开搜索框（PC端）
function expandSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.classList.add('search-expanded'); // 添加展开样式
    }
}

// 收起搜索框（PC端）
function collapseSearch() {
    const searchInput = document.getElementById('search-input');
    // 只有输入框为空时才收起
    if (searchInput && !searchInput.value) {
        searchInput.classList.remove('search-expanded'); // 移除展开样式
    }
    // 延迟隐藏搜索建议（避免点击时立即消失）
    setTimeout(() => {
        document.getElementById('search-suggestions').classList.add('hidden');
    }, 200);
}

// --- 4. 购物车逻辑 ---
// 添加商品到购物车
function addToCart(title, price) {
    cart.push({ title, price }); // 把商品加入购物车数组
    updateCartUI(); // 更新购物车显示
    
    // 显示"已添加"的反馈
    const btn = event.target;
    const originalText = btn.innerText; // 保存按钮原文本
    btn.innerText = "已添加 ✓"; // 更改按钮文本
    btn.classList.add("bg-green-100", "text-green-700"); // 添加成功样式
    // 1秒后恢复原样
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove("bg-green-100", "text-green-700");
    }, 1000);
}

// 从商品详情页添加商品到购物车
function addToCartFromDetail() {
    if (currentDetailId) { // 如果有当前查看的商品ID
        // 找到对应的商品，添加到购物车
        const product = products.find(p => p.id === currentDetailId);
        addToCart(product.title, product.price);
    }
}

// 切换购物车弹窗的显示/隐藏
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden'); // 切换hidden类（显示/隐藏）
}

// 更新购物车的页面显示
function updateCartUI() {
    // 更新购物车商品数量
    document.getElementById('cart-count').innerText = cart.length;
    
    // 获取购物车列表和总价元素
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    let html = ''; // 购物车列表的HTML
    let total = 0; // 总价
    
    if (cart.length === 0) {
        // 购物车为空时显示提示
        html = '<li class="text-gray-500 text-center py-4">购物车是空的</li>';
    } else {
        // 遍历购物车商品，生成列表并计算总价
        cart.forEach((item, index) => {
            total += item.price; // 累加价格
            html += `
                <li class="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                    <span class="truncate w-32">${item.title}</span>
                    <span class="font-bold text-gray-700">¥${item.price}</span>
                </li>
            `;
        });
    }

    // 更新页面显示
    cartList.innerHTML = html;
    cartTotal.innerText = '¥ ' + total;
}

// --- 5. 购买流程 ---
// 直接购买商品（从列表页）
function buyNow(title, price) {
    addToCart(title, price); // 先加入购物车
    showPage('checkout'); // 跳转到结算页
}

// 从商品详情页直接购买
function buyNowFromDetail() {
    if (currentDetailId) { // 如果有当前查看的商品ID
        // 找到对应的商品，执行购买
        const product = products.find(p => p.id === currentDetailId);
        buyNow(product.title, product.price);
    }
}

// 跳转到结算页
function goToCheckout() {
    if (cart.length === 0) { // 购物车为空时提示
        alert('购物车是空的，去选购一些商品吧！');
        return;
    }
    showPage('checkout'); // 跳转到结算页
}

// --- 6. 结算页面逻辑 ---
// 渲染结算页面内容
function renderCheckoutPage() {
    // 获取结算页元素
    const list = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    const countEl = document.getElementById('checkout-count-hint');
    
    if (cart.length === 0) {
        // 购物车为空时的显示
        list.innerHTML = '<div class="text-center text-gray-500 py-10 bg-gray-50 rounded">还没有选择商品</div>';
        totalEl.innerText = '¥ 0';
        countEl.innerText = '共 0 件商品';
        return;
    }

    let html = ''; // 商品列表HTML
    let total = 0; // 总价
    
    // 统计每种商品的数量和总价
    const itemCounts = {};
    cart.forEach(item => {
        if (itemCounts[item.title]) {
            // 已有该商品，数量+1，总价累加
            itemCounts[item.title].count++;
            itemCounts[item.title].totalPrice += item.price;
        } else {
            // 新商品，初始化数量为1，记录单价和图片
            itemCounts[item.title] = { 
                price: item.price, 
                count: 1, 
                totalPrice: item.price,
                img: products.find(p => p.title === item.title)?.img || ''
            };
        }
        total += item.price; // 累加总价
    });

    // 生成商品列表HTML
    for (const [title, info] of Object.entries(itemCounts)) {
        html += `
            <li class="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition">
                <div class="flex items-center gap-4">
                    <img src="${info.img}" class="w-16 h-16 object-cover rounded-lg bg-gray-200">
                    <div>
                        <span class="font-bold text-lg text-gray-800">${title}</span>
                        <div class="text-sm text-gray-500 mt-1">单价: ¥${info.price} &times; <span class="text-blue-600 font-bold bg-blue-100 px-2 rounded">${info.count}</span></div>
                    </div>
                </div>
                <span class="font-bold text-xl text-gray-800">¥ ${info.totalPrice}</span>
            </li>
        `;
    }

    // 更新结算页显示
    list.innerHTML = html;
    totalEl.innerText = '¥ ' + total;
    countEl.innerText = `共 ${cart.length} 件商品`;
}

// 处理支付（结算）
function handlePayment(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    if (cart.length === 0) { // 没有商品时提示
        alert('没有商品可结算');
        return;
    }
    
    // 获取支付按钮，修改状态为"支付中"
    const btn = event.target.querySelector('button');
    const oldText = btn.innerHTML;
    btn.innerHTML = '支付中...';
    btn.disabled = true;

    // 模拟支付过程（1.5秒后完成）
    setTimeout(() => {
        // 如果用户已登录，创建订单记录
        if (currentUser) {
            const order = {
                id: Date.now(), // 用时间戳做订单号
                userId: currentUser.id, // 关联用户ID
                username: currentUser.username, // 用户名
                items: [...cart], // 订单商品（复制购物车）
                total: cart.reduce((sum, item) => sum + item.price, 0), // 订单总价
                date: new Date().toLocaleString(), // 订单时间
                address: event.target.querySelector('textarea').value, // 收货地址
                status: '已完成' // 订单状态
            };
            
            orders.push(order); // 加入订单列表
            localStorage.setItem('shop_orders', JSON.stringify(orders)); // 保存到本地存储
        }
        
        // 支付成功提示
        alert('🎉 支付成功！\n\n感谢您的购买，商品将尽快送达。');
        
        cart = []; // 清空购物车
        updateCartUI(); // 更新购物车显示
        
        // 恢复按钮状态
        btn.innerHTML = oldText;
        btn.disabled = false;

        showPage('home'); // 回到首页
    }, 1500);
}

// --- 7. 详情页显示 ---
// 显示商品详情页
function showProductDetail(id) {
    // 找到对应的商品
    const product = products.find(p => p.id === id);
    if (product) {
        currentDetailId = id; // 记录当前查看的商品ID
        // 更新详情页内容
        document.getElementById('detail-title').innerText = product.title;
        document.getElementById('detail-price').innerText = '¥ ' + product.price;
        document.getElementById('detail-desc').innerText = product.desc;
        document.getElementById('detail-img').src = product.img;
        showPage('detail'); // 显示详情页
    }
}

// --- 8. 登录逻辑 ---
// 处理登录表单提交
function handleLogin(event) {
    event.preventDefault(); // 阻止表单默认提交
    // 获取输入的用户名和密码
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // 验证输入不为空
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    // 查找匹配的用户（用户名和密码都对）
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 登录成功
        currentUser = user;
        alert('登录成功！欢迎回来，' + username);
        showPage('home'); // 回到首页
        updateLoginButton(); // 更新登录按钮
    } else {
        // 登录失败
        alert('用户名或密码错误，请重试或注册新账号');
    }
}

// --- 9. 注册逻辑 ---
// 处理注册表单提交
function handleRegister(event) {
    event.preventDefault(); // 阻止表单默认提交
    
    // 获取注册信息
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const agreement = document.getElementById('reg-agreement').checked;
    
    // 验证表单
    if (!username || !email || !password || !confirmPassword) {
        alert('请填写所有必填字段');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }
    
    if (password.length < 6) {
        alert('密码长度至少为6位');
        return;
    }
    
    if (!agreement) {
        alert('请同意服务条款和隐私政策');
        return;
    }
    
    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
        alert('用户名已存在，请选择其他用户名');
        return;
    }
    
    // 检查邮箱是否已注册
    if (users.some(u => u.email === email)) {
        alert('邮箱已被注册，请使用其他邮箱');
        return;
    }
    
    // 创建新用户
    const newUser = {
        id: Date.now(), // 用时间戳做用户ID
        username,
        email,
        password,
        registerDate: new Date().toLocaleDateString() // 注册日期
    };
    
    users.push(newUser); // 加入用户列表
    localStorage.setItem('shop_users', JSON.stringify(users)); // 保存到本地存储
    
    currentUser = newUser; // 自动登录新用户
    alert('注册成功！现在可以使用您的账号登录。');
    showPage('home'); // 回到首页
    updateLoginButton(); // 更新登录按钮
}

// --- 10. 订单历史功能 ---
// 显示订单历史页面
function showOrderHistory() {
    if (!currentUser) {
        // 未登录时也显示页面（会有登录提示）
        showPage('order-history');
        return;
    }
    
    // 获取当前用户的所有订单
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    // 获取订单页元素
    const orderLoginPrompt = document.getElementById('order-login-prompt');
    const orderList = document.getElementById('order-list');
    const orderItems = document.getElementById('order-items');
    const noOrders = document.getElementById('no-orders');
    
    if (userOrders.length === 0) {
        // 没有订单时的显示
        orderLoginPrompt.classList.add('hidden');
        orderList.classList.add('hidden');
        noOrders.classList.remove('hidden');
    } else {
        // 有订单时的显示
        orderLoginPrompt.classList.add('hidden');
        noOrders.classList.add('hidden');
        orderList.classList.remove('hidden');
        
        // 按订单时间降序排列（最新的在前）
        userOrders.sort((a, b) => b.id - a.id);
        
        let ordersHTML = ''; // 订单列表HTML
        userOrders.forEach(order => {
            // 统计订单中每种商品的数量
            const itemCounts = {};
            order.items.forEach(item => {
                if (itemCounts[item.title]) {
                    itemCounts[item.title]++;
                } else {
                    itemCounts[item.title] = 1;
                }
            });
            
            // 生成商品列表文本（如"商品1 ×2，商品2 ×1"）
            const itemList = Object.entries(itemCounts).map(([title, count]) => 
                `${title} ×${count}`
            ).join('，');
            
            // 生成单个订单的HTML
            ordersHTML += `
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-bold text-lg text-gray-800">订单号: ${order.id}</h3>
                            <p class="text-gray-500 text-sm mt-1">${order.date}</p>
                        </div>
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">${order.status}</span>
                    </div>
                    
                    <div class="mb-4">
                        <p class="text-gray-700 mb-2"><span class="font-medium">商品：</span>${itemList}</p>
                        <p class="text-gray-700"><span class="font-medium">收货地址：</span>${order.address}</p>
                    </div>
                    
                    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span class="text-gray-600">共 ${order.items.length} 件商品</span>
                        <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">¥ ${order.total}</span>
                    </div>
                </div>
            `;
        });
        
        // 更新订单列表显示
        orderItems.innerHTML = ordersHTML;
    }
    
    showPage('order-history'); // 显示订单历史页
}

// 页面加载完成后执行
window.onload = function() {
    showPage('home'); // 默认显示首页
    updateLoginButton(); // 更新登录按钮状态
    
    // 检查是否有已注册用户（仅作提示，实际项目中需用cookie/session保持登录）
    if (users.length > 0 && !currentUser) {
        console.log('有已注册用户，但需要手动登录');
    }
};