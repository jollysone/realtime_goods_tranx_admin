import {
  Icon,
  Popover,
  Form,
  Input,
  Upload,
  Select,
  Radio,
  DatePicker,
  Cascader,
  InputNumber,
  Switch,
} from 'antd';
import styles from './formUtils.less';
import moment from 'moment/moment';
import React from "react";

const {Option} = Select;

export const formItemLayoutHalf = {
  labelCol: {span: 3},
  wrapperCol: {span: 10},
};

export const formItemLayoutDefault = {
  labelCol: {},
  wrapperCol: {},
};

// 表单项

export function textAreaFormItem(
  form,
  name,
  label,
  initialValue,
  formAttr = {},
  areaAttr = {},
  required = true,
  append = null
) {
  const {getFieldDecorator} = form;
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请输入${label}`}],
        initialValue: initialValue,
      })(<Input.TextArea placeholder={`请输入${label}`} rows={4} {...areaAttr} />)}
      {append}
    </Form.Item>
  );
}

export function inputFormItem(
  form,
  name,
  label,
  initialValue,
  formAttr = {},
  inputAttr = {},
  required = true,
  append = null
) {
  const {getFieldDecorator} = form;
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请输入${label}`}],
        initialValue: initialValue,
      })(<Input placeholder={`请输入${label}`} {...inputAttr} />)}
      {append}
    </Form.Item>
  );
}

export function numberInputFormItem(
  form,
  name,
  label,
  initialValue,
  formAttr = {},
  inputAttr = {},
  required = true,
  append = null
) {
  const {getFieldDecorator} = form;
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请输入${label}`}],
        initialValue: initialValue,
      })(<InputNumber placeholder={`${label}`} {...inputAttr} />)}
      <nobr>{append}</nobr>
    </Form.Item>
  );
}

export function labelFormItem(label, value, formAttr = {}, append = null) {
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {value}
    </Form.Item>
  );
}

export function datePickerFormItem(
  form,
  name,
  label,
  initialValue,
  formAttr = {},
  pickerAttr = {},
  required = true
) {
  const {getFieldDecorator} = form;
  if (pickerAttr.showTime && !pickerAttr.format) {
    pickerAttr.format = 'YYYY-MM-DD HH:mm:ss';
  }
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请选择${label}！`}],
        initialValue: initialValue
          ? moment(initialValue, pickerAttr.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
          : null,
      })(<DatePicker placeholder={`请选择${label}`} {...pickerAttr} />)}
    </Form.Item>
  );
}

export function dateRangePickerFormItem(
  form,
  name,
  label,
  initialValue,
  formAttr = {},
  pickerAttr = {},
  required = true
) {
  const {getFieldDecorator} = form;
  if (pickerAttr.showTime && !pickerAttr.format) {
    pickerAttr.format = 'YYYY-MM-DD HH:mm:ss';
  }
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请选择${label}！`}],
        initialValue: initialValue,
      })(
        <DatePicker.RangePicker
          ranges={{
            今天: [moment().startOf('day'), moment().endOf('day')],
            本周: [moment().startOf('week'), moment().endOf('week')],
            本月: [moment().startOf('month'), moment().endOf('month')],
            昨天: [
              moment()
                .subtract(1, 'd')
                .startOf('day'),
              moment()
                .subtract(1, 'd')
                .endOf('day'),
            ],
            上周: [
              moment()
                .subtract(7, 'd')
                .startOf('week'),
              moment()
                .subtract(7, 'd')
                .endOf('week'),
            ],
            上月: [
              moment()
                .subtract(1, 'M')
                .startOf('month'),
              moment()
                .subtract(1, 'M')
                .endOf('month'),
            ],
          }}
          {...pickerAttr}
        />
      )}
    </Form.Item>
  );
}

export function cascaderFormItem(
  form,
  name,
  label,
  initialValue,
  optionsList,
  formAttr = {},
  cascaderAttr = {},
  required = true
) {
  const {getFieldDecorator} = form;
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请选择${label}！`}],
        initialValue: initialValue,
      })(<Cascader options={optionsList} placeholder={`请选择${label}`} {...cascaderAttr} />)}
    </Form.Item>
  );
}

export function selectFormItem(
  form,
  name,
  label,
  initialValue,
  list,
  formAttr = {},
  selectAttr = {},
  required = true,
  append = null
) {
  const {getFieldDecorator} = form;
  let initValue = initialValue;
  if (initialValue === undefined) {
    initValue = '';
  } else if (typeof initialValue === 'number') {
    initValue = initialValue + '';
  }
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {getFieldDecorator(name, {
        rules: [{required: required, message: `请选择${label}`}],
        initialValue: initValue,
      })(
        <Select
          notFoundContent={`无匹配`}
          dropdownMatchSelectWidth={true}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          {...selectAttr}
        >
          {list.map(item => (
            <Option key={item.id} value={item.id} {...item.options}>{`${item.text}`}</Option>
          ))}
        </Select>
      )}
      {append}
    </Form.Item>
  );
}

export function switchFormItem(
  form,
  name,
  label,
  initialValue,
  formAttr = {},
  switchAttr = {},
  append = null
) {
  const {getFieldDecorator} = form;
  if (typeof initialValue !== 'boolean') {
    initialValue = !!parseInt(initialValue);
  }
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {
        getFieldDecorator(name, {
          valuePropName: 'checked',
          initialValue: initialValue,
        })
        (<Switch checkedChildren="是" unCheckedChildren="否" {...switchAttr} />)
      }
      {append && (
        <span>
          <br/>
          {append}
        </span>
      )}
    </Form.Item>
  );
}

export function radioFormItem(
  form,
  name,
  label,
  initialValue,
  list,
  formAttr = {},
  radioAttr = {},
  required = true,
  append = null
) {
  const {getFieldDecorator} = form;
  return (
    <Form.Item label={label} {...formItemLayoutHalf} {...formAttr}>
      {
        getFieldDecorator(name, {
          rules: [{required: required, message: `请选择${label}`}],
          initialValue: initialValue,
        })(
          <Radio.Group {...radioAttr}>
            {list.map(item => (
              <Radio key={item.id} value={item.id}>{`${item.text}`}</Radio>
            ))}
          </Radio.Group>
        )
      }
      {append && (
        <span>
          <br/>
          {append}
        </span>
      )}
    </Form.Item>
  );
}

export function uploadFormItem(
  instance,
  label,
  fileListPath,
  onPreview,
  maxSize = 1,
  formAttr = {},
  uploadAttr = {},
  required = true
) {
  const fileList = eval(`instance.state.${fileListPath}`);
  return (
    <Form.Item label={label} required={required} {...formItemLayoutHalf} {...formAttr}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={onPreview}
        onChange={file => {
          handleUploadChange(instance, fileListPath, file);
        }}
        beforeUpload={file => {
          return handleBeforeUpload(instance, fileListPath, file);
        }}
        className={fileListPath}
        {...uploadAttr}
      >
        {fileList.length >= maxSize ? null : uploadButton}
      </Upload>
    </Form.Item>
  );
}

//表单验证

export function getFormErrorInfo(form, fieldLabels) {
  const {getFieldsError} = form;
  const errors = {
    ...getFieldsError(),
  };
  const errorCount = Object.keys(errors).filter(key => errors[key]).length;
  if (!errors || errorCount === 0) {
    return null;
  }
  const scrollToField = fieldKey => {
    const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
    if (labelNode) {
      labelNode.scrollIntoView(true);
    }
  };
  const errorList = Object.keys(errors).map(key => {
    if (!errors[key]) {
      return null;
    }
    // const node = document.querySelector(`.${key} .ant-upload`);
    // if(node){
    //   node.style.borderColor='red';
    // }
    return (
      <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
        <Icon type="cross-circle-o" className={styles.errorIcon}/>
        <div className={styles.errorMessage}>{errors[key][0]}</div>
        <div className={styles.errorField}>{fieldLabels[key]}</div>
      </li>
    );
  });
  return (
    <span className={styles.errorIcon}>
      <Popover
        title="表单校验信息"
        content={errorList}
        overlayClassName={styles.errorPopover}
        trigger="click"
        getPopupContainer={trigger => trigger.parentNode}
      >
        <Icon type="exclamation-circle"/>
        {errorCount} 个问题，点击查看
      </Popover>
    </span>
  );
}

// 上传相关

export const uploadButton = (
  <div>
    <Icon type="plus"/>
    <div className="ant-upload-text">上传</div>
  </div>
);

export function handleUploadChange(instance, field, {file}) {
  if (file.status === 'removed') {
    const fileList = eval(`instance.state.${field}`);
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    eval(`instance.state.${field} = newFileList`);

    instance.setState({
      files: {
        ...instance.state.files,
      },
    });
  }
}

export function handleBeforeUpload(instance, field, file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = e => {
    const f = file;
    f.url = e.target.result;
    eval(`instance.state.${field} = [...instance.state.${field}, f]`);
    instance.setState({
      files: {
        ...instance.state.files,
      },
    });
  };
  return false;
}

export function getErrorInfo(form, fieldLabels = {}) {
  const {getFieldsError} = form;
  const errors = getFieldsError();
  const errorCount = Object.keys(errors).filter(key => errors[key]).length;
  if (!errors || errorCount === 0) {
    return null;
  }
  const scrollToField = fieldKey => {
    const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
    if (labelNode) {
      labelNode.scrollIntoView(true);
    }
  };
  const errorList = Object.keys(errors).map(key => {
    if (!errors[key]) {
      return null;
    }
    return (
      <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
        <Icon type="cross-circle-o" className={styles.errorIcon}/>
        <div className={styles.errorMessage}>{errors[key][0]}</div>
        <div className={styles.errorField}>{fieldLabels[key]}</div>
      </li>
    );
  });
  return (
    <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle"/>
        </Popover>
      {errorCount}
      </span>
  );
};
