(async () => {
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    chatMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  let user = {};

  // 渲染用户信息
  const setUserInfo = () => {
    if (user) {
      doms.aside.nickname.innerText = user.nickname;
      doms.aside.loginId.innerText = user.loginId;
    }
  };

  // 格式化时间前置0
  const padStartZero = (time) => time.toString().padStart(2, "0");

  // 格式化日期
  const formateDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${padStartZero(
      date.getMonth() + 1
    )}-${date.getDate()} ${padStartZero(date.getHours())}:${padStartZero(
      date.getMinutes()
    )}:${padStartZero(date.getSeconds())}`;
  };

  // 添加一条消息
  const addMessage = (chatInfo) => {
    const isMe = !!chatInfo.from;

    const msgItem = $$$("div");
    msgItem.className = isMe ? "chat-item me" : "chat-item";

    const avatar = $$$("img");
    avatar.className = "chat-avatar";
    avatar.src = isMe ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formateDate(chatInfo.createdAt);

    msgItem.appendChild(avatar);
    msgItem.appendChild(content);
    msgItem.appendChild(date);
    doms.chatContainer.appendChild(msgItem);
  };

  // 滚动到最后一条聊天消息
  const scrollToBottom = () => {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  };

  // 获取聊天消息记录
  const getChatMessages = async () => {
    const res = await API.getChatMessage();
    res.data.map((r) => addMessage(r));
    scrollToBottom();
  };

  /**
   * 初始化
   */
  const init = async () => {
    // 如果当前未登录，则返回登录页面
    const res = await API.getUser();
    user = res.data;
    if (!user) {
      alert(res.msg);
      location.href = "login.html";
      return;
    }

    setUserInfo();
    getChatMessages();
  };
  await init();

  // 注销
  const signOut = () => {
    if (confirm("确定要退出登录吗？")) {
      API.signOut();
      location.href = "login.html";
    }
  };

  // 发送一条消息
  const sendChatMessage = async () => {
    const message = doms.chatMsg.value.trim();
    if (!message) return;

    addMessage({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content: message,
    });
    scrollToBottom();
    doms.chatMsg.value = "";

    const resp = await API.sendChatMessage(message);
    if (resp.code === 0) {
      addMessage({
        from: null,
        to: user.loginId,
        ...resp.data,
      });
      scrollToBottom();
    }
  };

  /**
   * 交互
   */
  doms.close.onclick = signOut;

  doms.msgContainer.onsubmit = (e) => {
    e.preventDefault();
    sendChatMessage();
  };
})();
