import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Alert, Avatar, Button, Card, Divider, Form, message, Modal, Popover, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';
import { formItemLayoutDefault, inputFormItem, selectFormItem } from '../../utils/formUtils';
import {
  constDefaultPages,
  constUserStatuses,
  constBoolYesOrNo,
  constUserGenders,
} from '../../utils/values';
import { getSelectDataByKv } from '../../utils/utils';
import { apiPatchUsers } from '../../services/api';
import router from "umi/router";

/* eslint react/no-multi-comp:0 */
@connect(state => ({}))
@Form.create()
class List extends PureComponent {
  state = {
    requestData: { ...constDefaultPages },
    responseData: {},
    userGenders: [],
    userEnabledStatuses: [],
    boolYesOrNo: [],
    loading: true,
  };

  componentDidMount() {
    this.setState({
      userGenders: getSelectDataByKv(constUserGenders),
      userEnabledStatuses: getSelectDataByKv(constUserStatuses),
      boolYesOrNo: getSelectDataByKv(constBoolYesOrNo),
    });

    this.reloadData();
  }

  reloadData() {
    const { requestData } = this.state;

    this.setState({
      loading: true,
    });

    apiPatchUsers(requestData).then(response => {
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

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { requestData } = this.state;

    requestData.page_index = pagination.current;
    requestData.page_size = pagination.pageSize;

    this.reloadData();
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.state.requestData = {
        ...this.state.requestData,
        ...values,
        page_index: 1,
      };
      this.reloadData();
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.state.requestData = { ...constDefaultPages };
    this.reloadData();
  };

  renderFilterForm() {
    const { form } = this.props;
    const { userEnabledStatuses, boolYesOrNo } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {inputFormItem(form, 'phone', '手机号', '', { ...formItemLayoutDefault }, {}, false)}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            查询
          </Button>
          <Button htmlType="button" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  }

  onClickEditUser = (user) => {
    router.push('/user/edit/' + user.id);
  };

  render() {
    const {
      responseData: { list, page_index: current, page_size: pageSize, total },
      loading,
    } = this.state;

    const action = (
      <Fragment>
        <Button htmlType="button" type="primary" icon="plus" onClick={() => {
          router.push('/user/add')
        }}>
          新增用户
        </Button>
      </Fragment>
    );

    const columns = [
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '昵称',
        dataIndex: 'nick',
      },
      {
        title: '姓名',
        dataIndex: 'true_name',
      },
      {
        title: '学号',
        dataIndex: 'number',
      },
      {
        title: '买家信用',
        dataIndex: 'credit.buy_score',
      },
      {
        title: '卖家信用',
        dataIndex: 'credit.sell_score',
      },
      {
        title: '注册时间',
        dataIndex: 'created_at',
        width: '150px',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => {
          return constUserStatuses[val];
        },
      },
      {
        title: '操作',
        width: 80,
        fixed: 'right',
        render: row => (
          <div>
            <a onClick={() => this.onClickEditUser(row)}>编辑</a>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current,
      pageSize,
      total,
    };

    return (
      <PageHeaderWrapper title="用户列表" action={action}>
        <Card bordered={false} className={styles.filterCard} style={{ paddingBottom: 18 }}>
          <div className={styles.tableListFilterForm}>{this.renderFilterForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <div>
                    查找到 <a style={{ fontWeight: 600 }}>{total}</a> 条记录
                  </div>
                }
                type="info"
                showIcon
              />
            </div>
            <div className={styles.tableListOperator} />
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
