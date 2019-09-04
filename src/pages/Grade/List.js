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
import {apiPatchGrades, apiPatchUsers} from '../../services/api';
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

    apiPatchGrades(requestData).then(response => {
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

  onClickEdit = (user) => {
    router.push('/grade/edit/' + user.id);
  };

  render() {
    const {
      responseData: { list, page_index: current, page_size: pageSize, total },
      loading,
    } = this.state;

    const action = (
      <Fragment>
        <Button htmlType="button" type="primary" icon="plus" onClick={() => {
          router.push('/grade/add')
        }}>
          新增年级
        </Button>
      </Fragment>
    );

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '150px',
      },
      {
        title: '操作',
        width: 80,
        fixed: 'right',
        render: row => (
          <div>
            <a onClick={() => this.onClickEdit(row)}>编辑</a>
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
      <PageHeaderWrapper title="年级列表" action={action}>
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
