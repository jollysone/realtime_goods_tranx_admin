import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Alert, Avatar, Button, Card, Divider, Form, message, Modal, Popconfirm, Popover, Table} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';
import {formItemLayoutDefault, inputFormItem, selectFormItem} from '../../utils/formUtils';
import {
  constDefaultPages,
  constUserStatuses,
  constBoolYesOrNo,
  constUserGenders, constOrderStatuses,
} from '../../utils/values';
import {getSelectDataByKv} from '../../utils/utils';
import {apiDeleteOrder, apiPatchOrders, apiPatchUsers} from '../../services/api';
import router from "umi/router";

/* eslint react/no-multi-comp:0 */
@connect(state => ({}))
@Form.create()
class List extends PureComponent {
  state = {
    requestData: {...constDefaultPages},
    responseData: {},
    userGenders: [],
    orderStatuses: [],
    boolYesOrNo: [],
    loading: true,
  };

  componentDidMount() {
    this.setState({
      orderStatuses: getSelectDataByKv(constOrderStatuses),
      boolYesOrNo: getSelectDataByKv(constBoolYesOrNo),
    });

    this.reloadData();
  }

  reloadData() {
    const {requestData} = this.state;

    this.setState({
      loading: true,
    });

    apiPatchOrders(requestData).then(response => {
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
    const {orderStatuses} = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {selectFormItem(form, 'status', '状态', '', orderStatuses, {...formItemLayoutDefault}, {}, false)}
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

  onClickDeleteOrder = (order) => {
    apiDeleteOrder({sn:order.sn}).then(response=>{
      if(response.success){
        message.success('删除成功');
        this.reloadData();
      }
    });
  };

  render() {
    const {
      responseData: {list, page_index: current, page_size: pageSize, total},
      loading,
    } = this.state;

    const action = (
      <Fragment>

      </Fragment>
    );

    const columns = [
      {
        title: '图片',
        dataIndex: 'goods.pic_url',
        width: '100px',
        render: val => {
          return <img src={val} alt="" style={{width: '30px'}}/>;
        },
        fixed: 'left',
      },
      {
        title: '单号',
        dataIndex: 'sn',
      },
      {
        title: '商品',
        dataIndex: 'goods.title',
      },
      {
        title: '买家',
        render: row => (
          `${row.buyer.nick}(${row.buyer.phone})`
        ),
      },
      {
        title: '卖家',
        render: row => (
          `${row.seller.nick}(${row.seller.phone})`
        ),
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => {
          return constOrderStatuses[val]
        }
      },
      {
        title: '下单时间',
        dataIndex: 'created_at',
        width: '150px',
      },
      {
        title: '超时时间',
        dataIndex: 'will_timeout_at',
        width: '150px',
      },
      {
        title: '操作',
        width: 80,
        fixed: 'right',
        render: row => (
          <div>
            <Popconfirm title="确定删除这个订单吗？" onConfirm={() => this.onClickDeleteOrder(row)} okText="确定" cancelText="取消">
              <a href="#">删除</a>
            </Popconfirm>
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
      <PageHeaderWrapper title="订单列表" action={action}>
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
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default List;
