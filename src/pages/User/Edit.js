import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Alert, Button, Card, Form, Icon, Input, Layout, message, Modal, Popover, Spin, Table, Upload} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  apiGetDepartmentsAll, apiGetGradesAll,
  apiPatchUser,
  apiPostUser
} from '../../services/api';
import {
  formItemLayoutHalf,
  inputFormItem,
  labelFormItem,
  numberInputFormItem,
  selectFormItem, switchFormItem,
  textAreaFormItem, uploadFormItem,
} from '../../utils/formUtils';
import {apiBaseUrl, constBoolYesOrNo, constCreditLogTypes, constUserStatuses} from '../../utils/values';
import FooterToolbar from '../../components/FooterToolbar';
import router from 'umi/router';

/* eslint react/no-multi-comp:0 */
@connect(state => ({}))
@Form.create()
class Edit extends PureComponent {
  state = {
    requestData: {},
    responseData: {
      credit: {}
    },
    departments: [],
    grades: [],
    loading: true,
    submitting: false,
    editMode: true
  };

  componentDidMount() {
    const s = {};
    const {
      match: {params: p},
    } = this.props;

    s.requestData = {...p};
    s.editMode = !!p.id;
    s.loading = !!p.id;

    this.setState({...s});
    this.state.requestData = {...p};

    if (s.editMode) {
      this.loadData();
    }

    apiGetDepartmentsAll().then(response => {
      if (response.success) {
        this.setState({
          departments: response.data.map(item => {
            item.text = item.name;
            return item;
          })
        })
      }
    });

    apiGetGradesAll().then(response => {
      if (response.success) {
        this.setState({
          grades: response.data.map(item => {
            item.text = item.name;
            return item;
          })
        })
      }
    });
  }

  loadData() {
    const {requestData} = this.state;
    this.setState({
      loading: true,
    });

    apiPatchUser(requestData).then(response => {
      let responseData = {};
      if (response.success) {
        responseData = response.data;
      }
      this.setState({
        responseData,
        loading: false,
      });
    });
  }

  validateForm = () => {
    const {
      form: {validateFieldsAndScroll},
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const params = {
          id: this.state.editMode ? this.state.requestData.id : '',
          ...values,
        };
        this.setState({
          submitting: true,
        });
        apiPostUser(params).then(response => {
          if (response.success) {
            router.push('/user/list/');
          }
          this.setState({
            submitting: false,
          });
        });
      }
    });
  };

  render() {
    const {form} = this.props;
    const {responseData, loading, submitting, editMode, departments, grades} = this.state;
    const {getFieldDecorator} = form;

    const creditLogColumns = [
      {
        title: '类型',
        dataIndex: 'type',
        render: val => {
          return constCreditLogTypes[val];
        },
      },
      {
        title: '原信用分',
        dataIndex: 'old_score',
      },
      {
        title: '变更信用分',
        dataIndex: 'change_score',
      },
      {
        title: '原因',
        dataIndex: 'remark',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
      },
    ];

    return (
      <PageHeaderWrapper title={(editMode ? '编辑' : '新增') + '用户'}>
        <Spin spinning={loading && editMode}>
          <Layout style={{marginBottom: '30px'}}>
            <Form layout="horizontal">
              <Card title="编辑" bordered={false}>
                {inputFormItem(form, 'phone', '手机号', responseData.phone)}
                {inputFormItem(form, 'nick', '昵称', responseData.nick)}
                {inputFormItem(form, 'true_name', '姓名', responseData.true_name)}
                {inputFormItem(form, 'number', '学号', responseData.number)}
                {selectFormItem(form, 'department_id', '系别', responseData.department_id, departments)}
                {selectFormItem(form, 'grade_id', '年级', responseData.grade_id, grades)}
                {inputFormItem(form, 'password', '密码', '', {}, {}, !editMode, editMode ? '如不修改请留空' : '')}
              </Card>
              {
                editMode && (
                  <Layout>
                    <Card title="其他" bordered={false} style={{marginTop: '20px'}}>
                      {labelFormItem('ID', responseData.id)}
                      {labelFormItem('买家信用', responseData.credit.buy_score)}
                      {labelFormItem('卖家信用', responseData.credit.sell_score)}
                      {labelFormItem('创建时间', responseData.created_at)}
                    </Card>
                    <Card title="信用分记录" bordered={false} style={{marginTop: '20px'}}>
                      <Table
                        rowKey={record => record.id}
                        dataSource={responseData.credit.logs}
                        columns={creditLogColumns}
                      />
                    </Card>
                  </Layout>
                )
              }
            </Form>
          </Layout>
        </Spin>
        <FooterToolbar style={{width: this.state.width}} extra={''}>
          <Button
            type="default"
            onClick={() => {
              router.push('/user/list/')
            }}
            htmlType="button"
            style={{marginRight: '20px'}}
          >
            返回列表
          </Button>
          <Button
            type="primary"
            onClick={this.validateForm}
            loading={submitting}
            disabled={loading}
            htmlType="button"
          >
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default Edit;
