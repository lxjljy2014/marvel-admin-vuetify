import { ref, toValue } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';
import { $t } from '@/locales';
import { useRules } from 'vuetify/labs/rules';
import { VForm } from 'vuetify/components';

export function useFormRules() {
  const rules = useRules();

  const patternRules = {
    userName: rules.pattern(REG_USER_NAME, $t('form.userName.invalid')),
    phone: rules.pattern(REG_PHONE, $t('form.phone.invalid')),
    pwd: rules.pattern(REG_PWD, $t('form.pwd.invalid')),
    code: rules.pattern(REG_CODE_SIX, $t('form.code.invalid')),
    email: rules.pattern(REG_EMAIL, $t('form.email.invalid'))
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    userName: [createRequiredRule($t('form.userName.required')), patternRules.userName],
    phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule($t('form.pwd.required')), patternRules.pwd],
    code: [createRequiredRule($t('form.code.required')), patternRules.code],
    email: [createRequiredRule($t('form.email.required')), patternRules.email]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return rules.required(message);
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    const confirmPwdRule: App.Global.FormRule[] = [
      rules.required($t('form.confirmPwd.required')),
      rules.pattern(new RegExp(`^${toValue(pwd)}$`), $t('form.confirmPwd.invalid'))
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}

export function useVuetifyForm() {
  const formRef = ref<InstanceType<typeof VForm> | null>(null);

  const valid = ref<boolean | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.restoreValidation();
  }

  return {
    formRef,
    valid,
    validate,
    restoreValidation
  };
}
