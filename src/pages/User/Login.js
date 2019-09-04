import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Button, Form } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import { routerRedux } from 'dva/router';
import { apiPostToken } from '../../services/api';
import { reloadAuthorized } from '../../utils/Authorized';
import { getPageQuery } from '../../utils/utils';
import { setAuthority } from '../../utils/authority';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      this.setState({ submitting: true });
      apiPostToken(values).then(response => {
        this.setState({ submitting: false });
        if (response.success) {
          localStorage.setItem('token', response.data.token);
          setAuthority('admin');
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          dispatch(routerRedux.replace(redirect || '/'));
        }
      });
    }
  };

  render() {
    const { login } = this.props;
    const { type, submitting } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="管理员登录">
            <UserName name="phone" placeholder="管理员手机号" />
            <Password
              name="password"
              placeholder="密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <FormItem>
            <Button size="large" type="primary" htmlType="submit" loading={submitting} block>
              登录
            </Button>
          </FormItem>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
