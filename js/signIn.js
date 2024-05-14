const loginIdValidator = new FieldValidator("txtLoginId", async (val) => {
  // 是否为空
  if (!val) {
    return "请输入账号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async (val) => {
  // 是否为空
  if (!val) {
    return "请输入密码";
  }
});

const signInForm = $(".user-form");
signInForm.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validateAll(
    loginIdValidator,
    loginPwdValidator
  );
  // 校验失败
  if (!result) return;
  // 登录
  const formData = new FormData(signInForm);
  const userInfo = Object.fromEntries(formData.entries());
  const resp = await API.signIn(userInfo);
  if (resp.code === 0) {
    alert("登录成功！欢迎您！");
    location.href = "index.html";
  } else {
    loginIdValidator.p.innerText = "登录失败，请检查账号或密码" + resp.msg;
    loginPwdValidator.input.value = "";
  }
};
