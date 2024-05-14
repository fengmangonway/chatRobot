/**
 * 表单项验证类
 * 用户登录和注册页面的表单验证
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} inputId 当前校验的表单项的id
   * @param {Function} validator 验证规则函数，当需要校验时调用
   */
  constructor(inputId, validator) {
    this.input = $(`#${inputId}`);
    this.validator = validator;
    this.p = this.input.nextElementSibling;
    this.input.onblur = () => {
      this.validate();
    };
  }

  /**
   * 校验函数
   * @returns 校验结果，成功返回true，失败返回false
   */
  async validate() {
    const err = await this.validator(this.input.value);
    this.p.innerHTML = err || "";
    return !err;
  }

  /**
   * 静态方法，校验所有验证对象
   * @param {FieldValidator[]} validators 验证对象数组
   * @returns 所有验证对象的校验函数都返回true时返回true，有一个false则为false
   */
  static async validateAll(...validators) {
    const promises = validators.map((v) => v.validate());
    const res = await Promise.all(promises);
    return res.every((r) => r);
  }
}
