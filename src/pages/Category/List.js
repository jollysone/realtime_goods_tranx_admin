import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Alert, Avatar, Button, Card, Divider, Form, message, Modal, Popover, Table} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';
import {formItemLayoutDefault, inputFormItem, selectFormItem} from '../../utils/formUtils';
import {
  constDefaultPages,
  constUserStatuses,
  constBoolYesOrNo,
  constUserGenders,
} from '../../utils/values';
import {getSelectDataByKv} from '../../utils/utils';
import {apiPatchCategories, apiPatchUsers} from '../../services/api';
import router from "umi/router";

/* eslint react/no-multi-comp:0 */
@connect(state => ({}))
@Form.create()
class List extends PureComponent {
  state = {
    requestData: {...constDefaultPages},
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
    const {requestData} = this.state;

    this.setState({
      loading: true,
    });

    apiPatchCategories(requestData).then(response => {
      let responseData = {};
      if (response.success) {
        response.data.list = response.data.list.map(item => {
          item.childrenExpand = [...item.children];
          item.children = null;
          return item;
        });
        responseData = response.data;
      }
      this.setState({
        responseData,
        loading: false,
      });
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const {requestData} = this.state;

    requestData.page_index = pagination.current;
    requestData.page_size = pagination.pageSize;

    this.reloadData();
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const {form} = this.props;
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
    const {form} = this.props;
    form.resetFields();
    this.state.requestData = {...constDefaultPages};
    this.reloadData();
  };

  renderFilterForm() {
    const {form} = this.props;
    const {userEnabledStatuses, boolYesOrNo} = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {inputFormItem(form, 'name', '名称', '', {...formItemLayoutDefault}, {}, false)}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>
            查询
          </Button>
          <Button htmlType="button" style={{marginLeft: 8}} onClick={this.handleFormReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  }

  onClickEdit = (category) => {
    const parentId = category.parent_id ? category.parent_id : '0';
    router.push('/category/edit/' + parentId + '/' + category.id);
  };

  onClickNewChild = (category) => {
    router.push('/category/edit/' + category.id + '/0');
  };

  expandedRowRender = (data) => {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '商品数量',
        dataIndex: 'amount',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '150px',
      },
      {
        title: '操作',
        width: 80,
        render: row => {
          return (
            <div>
              <a onClick={() => this.onClickEdit(row)}>编辑</a>
            </div>
          )
        },
      }
    ];
    return (
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  };

  render() {
    const {
      responseData: {list, page_index: current, page_size: pageSize, total},
      loading,
    } = this.state;

    const action = (
      <Fragment>
        <Button htmlType="button" type="primary" icon="plus" onClick={() => {
          router.push('/category/add')
        }}>
          新增类别
        </Button>
      </Fragment>
    );

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '商品数量',
        dataIndex: 'amount',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '150px',
      },
      {
        title: '操作',
        width: 180,
        render: row => {
          return (
            <div>
              <a onClick={() => this.onClickEdit(row)}>编辑</a>
              <Divider type="vertical"/>
              <a onClick={() => this.onClickNewChild(row)}>新增下级</a>
            </div>
          )
        },
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
      <PageHeaderWrapper title="类别列表" action={action}>
        <Card bordered={false} className={styles.filterCard} style={{paddingBottom: 18}}>
          <div className={styles.tableListFilterForm}>{this.renderFilterForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <div>
                    查找到 <a style={{fontWeight: 600}}>{total}</a> 条记录
                  </div>
                }
                type="info"
                showIcon
              />
            </div>
            <div className={styles.tableListOperator}/>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              expandedRowRender={record => this.expandedRowRender(record.childrenExpand)}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
