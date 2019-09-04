export const envType = location.href.indexOf('://localhost') >= 0 ? 'dev' : 'pro';
export const apiBaseUrl = {dev: 'http://be.socket-shop.lab/', pro: 'http://api.neusoft.site/'}[envType];

export const uEditorConfig = {
  toolbars: [
    ['fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'paragraph', 'fontfamily', 'fontsize', '|', 'indent', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|', 'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',      /* 'simpleupload', */ 'insertimage', 'map', 'gmap', 'pagebreak', 'template', '|', 'horizontal', 'date', 'time', 'spechars', '|', 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|', 'searchreplace', 'drafts', 'help'],
  ],
  initialFrameHeight: 200,
  serverUrl: `${apiBaseUrl}ueditor/main`,
};

export const constBoolYesOrNo = {
  '0': '否',
  '1': '是',
};

export const constDefaultPages = {
  page_index: 1,
  page_size: 10,
};

export const constUserGenders = {
  '1': '男',
  '2': '女',
};

export const constUserStatuses = {
  '0': '禁用',
  '1': '正常',
};

export const constOrderStatuses = {
  '1': '交易中',
  '2': '完成',
  '3': '已取消',
  '4': '超时',
};

export const constCreditLogTypes = {
  '1': '基础',
  '2': '卖出',
  '3': '购买',
};
