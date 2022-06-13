<template>
  <div>
    <div id="device-list">
      <Checkbox @change="checkAll">全选</Checkbox>
      <CheckboxGroup v-model:value="choicedDevice">
        <Checkbox v-for="(item, index) in deviceList" :key="index" :value="item.value">{{
          item.label
        }}</Checkbox>
      </CheckboxGroup>
      <Button @click="getUsers" type="primary" :loading="guiData.loading">获取</Button>
    </div>
    <div id="control-bar">
      <InputSearch
        v-model:value="guiData.searchName"
        placeholder="按人名、考勤号搜索"
        @search="onSearchName"
        style="width: 200px"
      />
      <div style="display: inline-block; float: right">
        <Button @click="exportExcel">导出excel</Button>
      </div>
    </div>
    <div id="show-users">
      <vxe-table
        keep-source
        ref="table"
        :loading="guiData.loading"
        :data="users"
        border
        @checkbox-change="changeChoices"
        @checkbox-all="changeChoices"
        :max-height="700"
      >
        <vxe-table-column type="checkbox" width="60" />
        <vxe-table-column type="seq" title="序号" width="60" />
        <vxe-table-column field="enRollNum" title="考勤号" width="120" sortable />
        <vxe-table-column field="userName" title="名字" />
        <vxe-table-column v-if="guiData.isSearch" field="deviceId" title="考勤机" />
        <vxe-table-column v-if="guiData.isSearch" field="hasFinger" title="是否有指纹">
          <template #default="{ row }">
            <Tag v-if="row.hasFinger === true" color="green">有</Tag>
            <Tag v-else-if="row.hasFinger === false" color="red">无</Tag>
            <Spin v-else />
          </template>
        </vxe-table-column>
        <vxe-table-column field="enable" title="启用状态">
          <template #default="{ row }">
            <Tag v-if="row.enable == true" color="green">启用</Tag>
            <Tag v-else color="red">停用</Tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{ row }">
            <div class="control-btns">
              <Button @click="changeUserState(row, false)" size="small" v-if="row.enable == true"
                >停用</Button
              >
              <Button @click="changeUserState(row, true)" size="small" v-else>启用</Button>
              <Button @click="deleteUserAllData(row)" type="primary" danger size="small"
                >删除用户</Button
              >
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div v-show="guiData.isShowBottomBar && guiData.isSearch" id="bottom-contrl-bar">
        <Button type="primary" danger @click="batchDelete">批量删除</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import axios from 'axios';
  import { utils, write } from 'xlsx';
  import { saveAs } from 'file-saver';
  import moment from 'moment';
  import lodash from 'lodash-es';
  import { ref, reactive } from 'vue';
  import { VxeTableInstance } from 'vxe-table';
  import { Checkbox, CheckboxGroup, Button, Tag, InputSearch, Spin, message } from 'ant-design-vue';

  const baseURL = import.meta.env.VITE_ZKTIME_API_BASE_URL as string;
  const ZKAPI = reactive({
    getAllUserInfo: new URL('/users', baseURL).href,
    deleteUser: new URL('/delete_user', baseURL).href,
    enableUser: new URL('/enable_user', baseURL).href,
    hasFilgerTmp: new URL('/has_fingertmp', baseURL).href,
  });

  const guiData = reactive({
    isShowBottomBar: false,
    isSearch: false,
    searchName: '',
    loading: false,
  });

  type ZktimeUser = {
    deviceId: number;
    enRollNum: string;
    password: string;
    enable: boolean;
    privilege: number;
    userName: string;
    hasFinger: boolean;
  };

  type ZktimeDeviceValue = {
    ip: string;
    port: number;
    deviceNo: number;
  };

  type ZktimeDevice = {
    label: string;
    value: ZktimeDeviceValue;
  };

  const table = ref({} as VxeTableInstance);

  const choicedDevice = ref<ZktimeDeviceValue[]>([]);
  const deviceOriginData = ref([]);
  const users = ref<ZktimeUser[]>([]);
  // const merged_users = ref([]);
  const deviceList = reactive<ZktimeDevice[]>([
    { label: '1号机', value: { ip: '192.168.123.71', port: 4370, deviceNo: 1 } },
    { label: '2号机', value: { ip: '192.168.123.72', port: 4370, deviceNo: 2 } },
    { label: '3号机', value: { ip: '192.168.123.73', port: 4370, deviceNo: 3 } },
    { label: '4号机', value: { ip: '192.168.123.74', port: 4370, deviceNo: 4 } },
    { label: '5号机', value: { ip: '192.168.123.75', port: 4370, deviceNo: 5 } },
    { label: '6号机', value: { ip: '192.168.123.76', port: 4370, deviceNo: 6 } },
    { label: '7号机', value: { ip: '192.168.123.77', port: 4370, deviceNo: 7 } },
    { label: '8号机', value: { ip: '192.168.123.78', port: 4370, deviceNo: 8 } },
    { label: '9号机', value: { ip: '192.168.123.79', port: 4370, deviceNo: 9 } },
    { label: '10号机', value: { ip: '192.168.123.70', port: 4370, deviceNo: 10 } },
  ]);

  const getUsers = () => {
    guiData.loading = true;
    deviceOriginData.value = [];
    users.value = [];

    guiData.searchName = '';
    guiData.isSearch = false;
    console.log(choicedDevice.value);
    const awaitJobs = choicedDevice.value.map((device) => {
      return axios.post(ZKAPI.getAllUserInfo, device);
    });

    Promise.all(awaitJobs).then((values) => {
      console.log(values);
      const datas = values.map((res: any) => {
        return res.data;
      });

      deviceOriginData.value = [].concat(...datas);
      users.value = lodash.uniqBy(deviceOriginData.value, 'userName');
      guiData.loading = false;
    });
  };

  const checkAll = (e) => {
    choicedDevice.value = [];
    if (e.target.checked) {
      deviceList.forEach((item) => {
        choicedDevice.value.push(item.value);
      });
    }
  };

  const changeUserState = (row, state) => {
    const edmes = state ? '启用' : '禁用';
    if (confirm('确定 ' + edmes + row.userName + ' ？')) {
      guiData.loading = true;

      const awaitJobs = choicedDevice.value.map((device) => {
        const reqData = Object.assign({}, device);
        reqData.enRollNum = row.enRollNum;
        reqData.state = state;
        return axios.post(ZKAPI.enableUser, reqData);
      });

      Promise.all(awaitJobs).then(() => {
        getUsers();
      });
    }
  };

  // 根据设备编号获取机器信息
  const getDevice = (deviceNo: number) => {
    const index = lodash.findIndex(deviceList, function (o) {
      return String(o.value.deviceNo) === String(deviceNo);
    });

    return deviceList[index].value;
  };

  /**
   * 根据机器信息、考勤号删除，改机器上的人员信息
   */
  const deleteUser = (device, enRollNum) => {
    const reqData = Object.assign({}, device);
    reqData.enRollNum = enRollNum;
    return axios.post(ZKAPI.deleteUser, reqData);
  };

  const deleteUserAllData = (row) => {
    if (confirm('确定删除 ' + row.userName + ' 信息、指纹、人脸识别？')) {
      guiData.loading = true;

      if (guiData.isSearch) {
        // 删除单机, 单人
        const device = getDevice(row.deviceId);

        deleteUser(device, row.enRollNum).then((res) => {
          if (res.data.status === 'success') {
            lodash.remove(users.value, row);
            lodash.remove(deviceOriginData.value, row);
            table.value.reloadData(users.value);
          } else {
            message.error('删除失败');
          }
          guiData.loading = false;
        });
      } else {
        // 按机器，批量删
        const awaitJobs = choicedDevice.value.map((device) => {
          return deleteUser(device, row.enRollNum);
        });

        Promise.all(awaitJobs).then(() => {
          getUsers();
        });
      }
    }
  };

  const sheet2blob = (sheet, sheetName) => {
    sheetName = sheetName || 'sheet1';
    const workbook = {
      SheetNames: [sheetName],
      Sheets: {},
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

    const wopts: any = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
    };
    const wbout = write(workbook, wopts);

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], {
      type: 'application/octet-stream',
    }); // 字符串转ArrayBuffer

    return blob;
  };

  const exportExcel = () => {
    const header = ['deviceId', 'enRollNum', 'userName'];
    const headerDisplay = { deviceId: '考勤机', enRollNum: '考勤号', userName: '名字' };
    const eData = deviceOriginData.value.map(({ enRollNum, deviceId, userName }) => {
      return { deviceId, enRollNum, userName };
    });
    const data = lodash.uniq([headerDisplay, ...eData]);
    const sheet = utils.json_to_sheet(data, { header: header, skipHeader: true });
    saveAs(
      sheet2blob(sheet, 'ZK'),
      `考勤机人员名单_${moment().format('YYYY-MM-DD HH:mm:SSS')}.xlsx`,
    );
  };

  const onSearchName = () => {
    guiData.isSearch = true;

    if (guiData.searchName.length === 0) {
      guiData.loading = true;
      guiData.isSearch = false;
      users.value = lodash.uniqBy(deviceOriginData.value, 'userName');
      guiData.loading = false;
      return;
    }

    if (/^[0-9]*$/.test(guiData.searchName)) {
      // 考勤号搜索
      users.value = deviceOriginData.value.filter((item: any) => {
        return item.enRollNum.startsWith(guiData.searchName);
      });
    } else {
      // 人名搜索
      users.value = deviceOriginData.value.filter((item: any) => {
        return item.userName.startsWith(guiData.searchName);
      });
    }

    for (let i = 0; i < users.value.length; i++) {
      if (users.value[i].hasOwnProperty('hasFinger')) continue;

      let reqData = {
        deviceNo: 0,
        enRollNum: '',
      };
      reqData.deviceNo = users.value[i].deviceId;
      reqData.enRollNum = users.value[i].enRollNum;
      reqData = Object.assign(reqData, getDevice(reqData.deviceNo));
      axios.post(ZKAPI.hasFilgerTmp, reqData).then((res) => {
        users.value[i].hasFinger = res.data.hasFinger;
        table.value.reloadData(users.value);
      });
    }
  };

  const changeChoices = () => {
    guiData.isShowBottomBar = table.value.getCheckboxRecords().length > 0;
  };

  const batchDelete = () => {
    const rows = table.value.getCheckboxRecords();
    const awaitJobs = rows.map((row) => {
      const device = getDevice(row.deviceId);
      return deleteUser(device, row.enRollNum);
    });
    Promise.all(awaitJobs).then((res: any) => {
      console.log(res);
      getUsers();
    });
  };
</script>

<style lang="less" scoped>
  #show-users {
    margin-top: 1rem;
  }

  .control-btns {
    button {
      margin: 5px;
    }
  }

  #control-bar {
    margin-top: 1rem;
  }

  #bottom-contrl-bar {
    margin-top: 1rem;
  }
</style>
