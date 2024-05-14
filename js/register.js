const loginIdValidator = new FieldValidator("txtLoginId", async (val) => {
  // 是否为空
  if (!val) {
    return "请输入账号";
  }
  // 是否已注册
  const res = await API.checkExist(val);
  if (res.data) {
    return "该账号已被占用，请重新输入";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", async (val) => {
  // 是否为空
  if (!val) {
    return "请输入昵称";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async (val) => {
  // 是否为空
  if (!val) {
    return "请输入密码";
  }
});

const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async (val) => {
    // 是否为空
    if (!val) {
      return "请再次输入密码";
    }
    // 是否一致
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一致，请重新输入";
    }
  }
);

const registerForm = $(".user-form");
registerForm.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validateAll(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  // 校验失败
  if (!result) return;
  // 注册
  const formData = new FormData(registerForm);
  const userInfo = Object.fromEntries(formData.entries());
  const resp = await API.register(userInfo);
  if (resp.code === 0) {
    alert("注册成功！即将跳转登录页面...");
    location.href = "login.html";
  } else {
    alert(resp.msg);
  }
};
