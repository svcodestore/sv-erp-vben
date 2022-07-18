<template>
  <PageWrapper
    contentFullHeight
    title="排程参数设置"
    content=" 排程计划计算的参数设置，不同的设置将影响排程计算。"
  >
    <div class="mt-4">
      <p
        >{{ bisectionCount?.remark }}：
        <InputNumber
          v-model:value="bisectionCountVal"
          :min="1"
          :max="36"
          @change="handleBisectionCountChange"
        />
      </p>
      <p>
        {{ maxCostCalc?.remark }}：
        <Switch
          :loading="maxCostCalcLoading"
          :checked="maxCostCalcBool"
          @change="handleMaxCostChange"
        />
      </p>
      <p>
        {{ shifts?.remark }}：
        <Button type="link" @click="shiftDrawerVisible = true">
          <span style="text-decoration: underline">{{ shiftsStr }}</span>
        </Button>
      </p>

      <Drawer
        placement="right"
        :width="820"
        :maskClosable="false"
        :closable="false"
        v-model:visible="shiftDrawerVisible"
      >
        <template #title>
          <div class="flex">
            <span>{{ shifts?.remark }}</span>
            <Button shape="circle" type="primary" ghost class="ml-auto" @click="handleAddShift">
              <PlusOutlined />
            </Button>
          </div>
        </template>
        <template v-if="shiftsArr.length">
          <Card
            v-for="(sft, idx) in shiftsArr"
            :key="idx"
            :title="`${sft.name}：`"
            style="margin-bottom: 10px"
          >
            <template #extra>
              <Button type="link" @click="handleEditShift(idx)">修改</Button>
              <Button type="link" @click="shiftsArr.splice(idx, 1)" v-if="shiftsArr.length > 1">
                删除
              </Button>
            </template>
            <CardGrid
              v-for="(t, i) in sft.times"
              :key="i"
              :style="`width: ${100 / sft.times.length}%; text-align: center`"
            >
              <span>
                {{ t.name }}：{{ dateUtil(t.start).format('HH:mm') }} -
                {{ dateUtil(t.end).format('HH:mm') }}
              </span>
            </CardGrid>
          </Card>
        </template>
        <div
          class="absolute bottom-0"
          style="
            width: 100%;
            border-top: 1px solid #e8e8e8;
            padding: 10px 16px;
            text-align: right;
            left: 0;
            background: #fff;
            border-radius: 0 0 4px 4px;
          "
        >
          <Button style="margin-right: 8px" @click="handleCancelSetShift">取消</Button>
          <Button type="primary" @click="handleSaveShifts" :loading="saveBtnLoading">保存</Button>
        </div>

        <Drawer
          placement="right"
          :width="410"
          :closable="false"
          :maskClosable="false"
          v-model:visible="shiftSettingDrawerVisible"
        >
          <template #title>
            <div class="flex">
              <span>{{ shiftSettingDrawerTitle }}</span>
              <Button
                shape="circle"
                type="primary"
                ghost
                class="ml-auto"
                @click="handleAddShiftTime"
              >
                <PlusOutlined />
              </Button>
            </div>
          </template>

          <div v-if="currentShiftIndex !== undefined && shiftsArr[currentShiftIndex]">
            <Row>
              <Col :span="6">
                <span style="font-weight: 900; line-height: 32px; letter-spacing: 3px">
                  班次名称：
                </span>
              </Col>
              <Col :span="18">
                <Input
                  v-model:value="shiftsArr[currentShiftIndex].name"
                  placeholder="班次名称，例如 A 班，白班"
                />
              </Col>
            </Row>
            <Divider v-if="shiftsArr[currentShiftIndex]?.times.length" />
            <div
              style="margin-bottom: 16px"
              v-for="(item, index) in shiftsArr[currentShiftIndex]?.times"
              :key="index"
            >
              <Row>
                <Col :span="6">
                  <span style="font-weight: 900; line-height: 32px; letter-spacing: 3px">
                    时段名称：
                  </span>
                </Col>
                <Col :span="18">
                  <Input v-model:value="item.name" placeholder="时段名称，例如上午，下午" />
                </Col>
              </Row>
              <Row style="margin-top: 10px">
                <Col :span="2">
                  <Button
                    type="link"
                    v-if="shiftsArr[currentShiftIndex]?.times.length > 1"
                    @click="shiftsArr[currentShiftIndex].times.splice(index, 1)"
                  >
                    X
                  </Button>
                </Col>
                <Col :span="4">
                  <span style="font-weight: 900; line-height: 32px; letter-spacing: 3px">
                    时段：
                  </span>
                </Col>
                <Col :span="18">
                  <Row>
                    <Col :span="11">
                      <TimePicker
                        placeholder="选择时间"
                        style="width: 100%"
                        :minuteStep="5"
                        :secondStep="60"
                        v-model:value="item.start"
                      />
                    </Col>
                    <Col :span="2" style="line-height: 32px; text-align: center">-</Col>
                    <Col :span="11">
                      <TimePicker
                        placeholder="选择时间"
                        style="width: 100%"
                        :minuteStep="5"
                        :secondStep="60"
                        v-model:value="item.end"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          <div
            class="absolute bottom-0"
            style="
              width: 100%;
              border-top: 1px solid #e8e8e8;
              padding: 10px 16px;
              text-align: right;
              left: 0;
              background: #fff;
              border-radius: 0 0 4px 4px;
            "
          >
            <Button style="margin-right: 8px" @click="handleCancelSetShiftTime"> 取消 </Button>
            <Button type="primary" @click="shiftSettingDrawerVisible = false">确定</Button>
          </div>
        </Drawer>
      </Drawer>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    Switch,
    InputNumber,
    Button,
    Drawer,
    Row,
    Col,
    Input,
    Divider,
    TimePicker,
    Card,
    CardGrid,
  } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { getParamByKey, setParam } from '/@/api/PROD/Param';
  import { ParamType } from '/@/api/PROD/Param/type';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { dateUtil } from '/@/utils/dateUtil';
  import { ShiftType } from './types';
  import { cloneDeep, isEqual } from 'lodash-es';

  const { createMessage } = useMessage();

  const shiftDrawerVisible = ref<boolean>(false);
  const shiftSettingDrawerVisible = ref<boolean>(false);
  const shiftSettingDrawerTitle = ref<string>('');
  const bisectionCount = ref<ParamType>();
  const bisectionCountVal = ref<number>(1);
  const maxCostCalc = ref<ParamType>();
  const maxCostCalcBool = ref<boolean>(false);
  const maxCostCalcLoading = ref<boolean>(false);
  const shifts = ref<ParamType>();
  const shiftsArr = ref<ShiftType[]>([]);
  const currentShiftIndex = ref<number>(0);
  const originalShiftsArr = ref<ShiftType[]>([]);
  const saveBtnLoading = ref<boolean>(false);

  getParamByKey('bisection_count').then((res) => {
    bisectionCount.value = res;
    bisectionCountVal.value = +res.value;
  });
  getParamByKey('max_cost_calc').then((res) => {
    maxCostCalc.value = res;
    maxCostCalcBool.value = res.value === 'true';
  });
  getParamByKey('shifts').then((res) => {
    shifts.value = res;
    try {
      shiftsArr.value = JSON.parse(res.value);
      shiftsArr.value.forEach((sft) => {
        sft.times.forEach((t) => {
          t.start = dateUtil(t.start);
          t.end = dateUtil(t.end);
        });
      });

      originalShiftsArr.value = cloneDeep(shiftsArr.value);
    } catch {}
  });

  const shiftsStr = computed(() => {
    return shiftsArr.value.reduce((prev, curr) => {
      return (
        prev +
        curr.times
          .reduce((p, c) => {
            return (
              p + ', ' + dateUtil(c.start).format('HH:mm') + ' - ' + dateUtil(c.end).format('HH:mm')
            );
          }, '')
          .slice(2) +
        `（${curr.name}）` +
        '; '
      );
    }, '');
  });

  const failNotify = () => {
    createMessage.info('设置失败');
  };

  const handleMaxCostChange = async () => {
    maxCostCalcLoading.value = true;

    const isOk = await setParam({
      key: 'max_cost_calc',
      update: {
        value: maxCostCalcBool.value === true ? 'false' : 'true',
      },
    });
    if (isOk) {
      maxCostCalcBool.value = !maxCostCalcBool.value;
    } else {
      failNotify();
    }

    maxCostCalcLoading.value = false;
  };

  const handleBisectionCountChange = async () => {
    if (bisectionCountVal.value) {
      const isOk = await setParam({
        key: 'bisection_count',
        update: {
          value: String(bisectionCountVal.value),
        },
      });

      if (!isOk) {
        failNotify();
      }
    }
  };

  const handleAddShift = () => {
    shiftSettingDrawerTitle.value = '班次添加';

    if (shiftsArr.value.length > 2) {
      createMessage.info('班次数量过多');
      return;
    }

    shiftsArr.value.push({
      name: '',
      times: [],
    });
    currentShiftIndex.value = shiftsArr.value.length - 1;
    shiftSettingDrawerVisible.value = true;
  };

  const handleAddShiftTime = () => {
    const currShift = shiftsArr.value[currentShiftIndex.value];

    if (currShift.times.length > 2) {
      createMessage.info('时段数量过多');
      return;
    }

    currShift.times.push({
      name: '',
      start: dateUtil(),
      end: dateUtil(),
    });
  };

  const handleEditShift = (shiftIndex: number) => {
    shiftSettingDrawerTitle.value = '班次修改';
    currentShiftIndex.value = shiftIndex;
    shiftSettingDrawerVisible.value = true;
  };

  const handleCancelSetShiftTime = () => {
    if (currentShiftIndex.value < originalShiftsArr.value.length) {
      shiftsArr.value[currentShiftIndex.value] = cloneDeep(
        originalShiftsArr.value[currentShiftIndex.value],
      );
    } else {
      shiftsArr.value.splice(currentShiftIndex.value, 1);
    }

    shiftSettingDrawerVisible.value = false;
  };

  const handleCancelSetShift = () => {
    shiftsArr.value = cloneDeep(originalShiftsArr.value);
    shiftDrawerVisible.value = false;
  };

  const handleSaveShifts = async () => {
    if (!isEqual(originalShiftsArr.value, shiftsArr.value)) {
      saveBtnLoading.value = true;

      const isOk = await setParam({
        key: 'shifts',
        update: { value: JSON.stringify(shiftsArr.value) },
      });
      saveBtnLoading.value = false;

      if (!isOk) {
        failNotify();
      }
    }

    shiftDrawerVisible.value = false;
  };
</script>
