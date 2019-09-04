import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Alert, Button, Card, Form, Icon, Input, Layout, message, Modal, Popover, Spin, Table, Upload} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  apiPatchDepartment, apiPostDepartment,
} from '../../services/api';
import {
  formItemLayoutHalf,
  inputFormItem,
  labelFormItem,
} from '../../utils/formUtils';
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
  }

  loadData() {
    const {requestData} = this.state;
    this.setState({
      loading: true,
    });

    apiPatchDepartment(requestData).then(response => {
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
        apiPostDepartment(params).then(response => {
          if (response.success) {
            router.push('/department/list/');
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
    const {responseData, loading, submitting, editMode} = this.state;
    const {getFieldDecorator} = form;

    return (
      <PageHeaderWrapper title={(editMode ? '编辑' : '新增') + '系别'}>
        <Spin spinning={loading && editMode}>
          <Layout style={{marginBottom: '30px'}}>
            <Form layout="horizontal">
              <Card title="编辑" bordered={false}>
                {inputFormItem(form, 'name', '名称', responseData.name)}
              </Card>
              {
                editMode && (
                  <Layout>
                    <Card title="其他" bordered={false} style={{marginTop: '20px'}}>
                      {labelFormItem('ID', responseData.id)}
                      {labelFormItem('创建时间', responseData.created_at)}
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
              router.push('/department/list/')
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
