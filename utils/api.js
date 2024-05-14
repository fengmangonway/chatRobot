const API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN = "chatToken";

  /**
   * 封装fetch的GET请求
   * @param {String} url 请求地址
   * @returns fetch-get请求
   */
  const GET = (url) => {
    const token = localStorage.getItem(TOKEN);
    return fetch(
      BASE_URL + url,
      token
        ? {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        : {}
    );
  };

  /**
   * 封装fetch的POST请求
   * @param {String} url 请求地址
   * @param {Object} obj 请求体对象
   * @returns fetch-post请求
   */
  const POST = (url, obj) => {
    const token = localStorage.getItem(TOKEN);
    return fetch(BASE_URL + url, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(obj),
    });
  };

  /**
   * 注册
   * @param {Object} userInfo 注册信息对象
   * @returns 注册接口返回的数据对象
   */
  const register = async (userInfo) => {
    const res = await POST("/api/user/reg", userInfo);
    return await res.json();
  };

  /**
   * 登录
   * @param {Object} userInfo 注册信息对象
   * @returns 登录接口返回的数据对象
   */
  const signIn = async (userInfo) => {
    const res = await POST("/api/user/login", userInfo);
    const resp = await res.json();
    if (resp.code === 0) {
      localStorage.setItem(TOKEN, res.headers.get("authorization"));
    }
    return resp;
  };

  /**
   * 注销
   */
  const signOut = () => {
    localStorage.removeItem(TOKEN);
  };

  /**
   * 验证账号是否存在
   * @param {String} loginId 登录账号
   * @returns 验证账号接口返回的数据对象
   */
  const checkExist = async (loginId) => {
    const res = await GET(`/api/user/exists?loginId=${loginId}`);
    return await res.json();
  };

  /**
   * 获取当前登录的用户信息
   * @returns 获取登录用户信息接口返回的数据对象
   */
  const getUser = async () => {
    const res = await GET("/api/user/profile");
    return await res.json();
  };

  /**
   * 发送聊天消息
   * @param {String} message 聊天消息
   * @returns 发送消息接口返回的数据对象
   */
  const sendChatMessage = async (message) => {
    const res = await POST("/api/chat", {
      content: message,
    });
    return await res.json();
  };

  /**
   * 获取聊天消息记录
   * @returns 获取消息记录接口返回的数据对象
   */
  const getChatMessage = async () => {
    const res = await GET("/api/chat/history");
    return await res.json();
  };

  return {
    register,
    signIn,
    signOut,
    checkExist,
    getUser,
    sendChatMessage,
    getChatMessage,
  };
})();
