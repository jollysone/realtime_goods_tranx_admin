import {stringify} from 'qs';
import request from '../utils/request';
import {apiBaseUrl} from '../utils/values';

export async function apiPostToken(params) {
  return request(apiBaseUrl + 'admin/token/by-pwd', {
    method: 'POST',
    body: {
      ...params,
      app_type: 2,
    },
  });
}

export async function apiPatchCurrentUser() {
  return request(apiBaseUrl + 'admin/user/current', {
    method: 'PATCH',
  });
}

export async function apiPatchUsers(body) {
  return request(apiBaseUrl + 'admin/users', {
    method: 'PATCH',
    body
  });
}

export async function apiPatchUser(body) {
  return request(apiBaseUrl + 'admin/user', {
    method: 'PATCH',
    body
  });
}

export async function apiPostUser(body) {
  return request(apiBaseUrl + 'admin/user', {
    method: 'POST',
    body
  });
}

export async function apiGetDepartmentsAll() {
  return request(apiBaseUrl + 'departments/all', {
    method: 'GET'
  });
}

export async function apiGetGradesAll() {
  return request(apiBaseUrl + 'grades/all', {
    method: 'GET'
  });
}

export async function apiPatchOrders(body) {
  return request(apiBaseUrl + 'admin/orders', {
    method: 'PATCH',
    body
  });
}

export async function apiDeleteOrder(body) {
  return request(apiBaseUrl + 'admin/order', {
    method: 'DELETE',
    body
  });
}

export async function apiPatchGrades(body) {
  return request(apiBaseUrl + 'admin/grades', {
    method: 'PATCH',
    body
  });
}

export async function apiPatchGrade(body) {
  return request(apiBaseUrl + 'admin/grade', {
    method: 'PATCH',
    body
  });
}

export async function apiPostGrade(body) {
  return request(apiBaseUrl + 'admin/grade', {
    method: 'POST',
    body
  });
}

export async function apiPatchDepartments(body) {
  return request(apiBaseUrl + 'admin/departments', {
    method: 'PATCH',
    body
  });
}

export async function apiPatchDepartment(body) {
  return request(apiBaseUrl + 'admin/department', {
    method: 'PATCH',
    body
  });
}

export async function apiPostDepartment(body) {
  return request(apiBaseUrl + 'admin/department', {
    method: 'POST',
    body
  });
}

export async function apiPatchCategories(body) {
  return request(apiBaseUrl + 'admin/categories', {
    method: 'PATCH',
    body
  });
}

export async function apiPatchCategory(body) {
  return request(apiBaseUrl + 'admin/category', {
    method: 'PATCH',
    body
  });
}

export async function apiPostCategory(body) {
  return request(apiBaseUrl + 'admin/category', {
    method: 'POST',
    body
  });
}
