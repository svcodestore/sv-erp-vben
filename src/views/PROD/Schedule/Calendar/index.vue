<template>
  <PageWrapper content-full-height title="生产行事历" content="行事历设置用于生产排程计算">
    <Spin :spinning="calendarLoading">
      <Calendar
        v-model:value="calendarDate"
        @select="handleCalendarSelect"
        @panel-change="handleCalendarPanelChange"
      >
        <template #dateCellRender="{ current }">
          <span
            v-if="
              arrangedCalendar.find((item) => item.date === current.format('YYYY-MM-DD'))?.isRest
            "
            style="color: red; font-size: 18px; margin-right: 5px"
          >
            休
          </span>
          <span
            v-if="
              arrangedCalendar.find((item) => item.date === current.format('YYYY-MM-DD'))
                ?.isRest === 0
            "
            style="color: #faad14; margin-right: 5px"
          >
            <template
              v-for="(sft, idx) in JSON.parse(
                arrangedCalendar.find((item) => item.date === current.format('YYYY-MM-DD'))
                  ?.profile || '',
              ).shifts"
              :key="idx"
            >
              <span :idx="idx">{{ sft.name }}</span>
              <br />
              <template v-for="(t, i) in sft.times" :key="i">
                <span :i="i">
                  {{ dateUtil(t.start).format('HH:mm') }} - {{ dateUtil(t.end).format('HH:mm') }}
                </span>
                <br />
              </template>
            </template>
          </span>
        </template>
      </Calendar>
    </Spin>

    <Modal
      v-model:visible="modalOptions.visible"
      :title="modalOptions.title"
      centered
      cancelText="取消"
      okText="保存"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      @ok="handleSaveCalendarSetting"
    >
      <div class="m-4">
        <p>
          当天休息：
          <Switch
            :checked="modalOptions.isRestDay"
            @change="modalOptions.isRestDay = !modalOptions.isRestDay"
          />
        </p>
        <template v-if="!modalOptions.isRestDay">
          <div v-for="(sft, idx) in shiftsArr" :key="idx">
            <Row>
              <Col :span="6">
                <span style="font-weight: 900; line-height: 32px; letter-spacing: 3px">
                  班次名称：
                </span>
              </Col>
              <Col :span="18">
                <Input v-model:value="sft.name" placeholder="班次名称，例如 A 班，白班" disabled />
              </Col>
            </Row>
            <Divider v-if="sft?.times.length" />
            <div style="margin-bottom: 16px" v-for="(item, index) in sft.times" :key="index">
              <Row>
                <Col :span="6">
                  <span style="font-weight: 900; line-height: 32px; letter-spacing: 3px">
                    时段名称：
                  </span>
                </Col>
                <Col :span="18">
                  <Input
                    v-model:value="item.name"
                    placeholder="时段名称，例如上午，下午"
                    disabled
                  />
                </Col>
              </Row>
              <Row style="margin-top: 10px">
                <Col :span="2">
                  <Button
                    type="link"
                    v-if="sft.times.length > 1"
                    @click="sft.times.splice(index, 1)"
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
        </template>
      </div>
    </Modal>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import {
    Spin,
    Calendar,
    Modal,
    Switch,
    Row,
    Col,
    TimePicker,
    Divider,
    Input,
    Button,
  } from 'ant-design-vue';
  import { cloneDeep, isEqual } from 'lodash-es';
  import { reactive, ref } from 'vue';
  import { ShiftType } from '../Setting/types';
  import { addCalendar, getCalendar, updateCalendar } from '/@/api/PROD/Calendar';
  import { CalendarType } from '/@/api/PROD/Calendar/type';
  import { getParamByKey } from '/@/api/PROD/Param';
  import { ParamType } from '/@/api/PROD/Param/type';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { dateUtil, DateUtil, DATE_FORMAT } from '/@/utils/dateUtil';

  const { createMessage } = useMessage();

  const calendarDate = ref<DateUtil>();
  const calendarLoading = ref<boolean>(true);
  const selectedDate = ref<DateUtil>();
  const shifts = ref<ParamType>();
  const shiftsArr = ref<ShiftType[]>([]);
  const originalShiftsArr = ref<ShiftType[]>([]);
  const arrangedCalendar = ref<CalendarType[]>([]);

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

  const date = dateUtil();
  getCalendar({ year: date.year(), month: date.month() + 1 }).then((res) => {
    arrangedCalendar.value = res;
    calendarLoading.value = false;
  });

  const modalOptions = reactive({
    visible: false,
    title: '',
    isRestDay: false,
  });
  const handleCalendarSelect = (date: DateUtil) => {
    selectedDate.value = date;
    modalOptions.title = `日工作行事设定（${date.format(DATE_FORMAT)}）`;

    const isArranged = arrangedCalendar.value.find(
      (item) => item.date === date.format('YYYY-MM-DD'),
    );
    if (isArranged) {
      if (isArranged.isRest) {
        modalOptions.isRestDay = Boolean(isArranged.isRest);
      } else {
        modalOptions.isRestDay = false;

        if (isArranged.profile) {
          try {
            const { shifts } = JSON.parse(isArranged.profile);
            if (shifts) {
              (shifts as ShiftType[]).forEach((sft) => {
                sft.times.forEach((t) => {
                  t.start = dateUtil(t.start);
                  t.end = dateUtil(t.end);
                });
              });
              shiftsArr.value = cloneDeep(shifts);
            }
          } catch {}
        } else {
          shiftsArr.value = cloneDeep(originalShiftsArr.value);
        }
      }
    } else {
      modalOptions.isRestDay = false;
      shiftsArr.value = cloneDeep(originalShiftsArr.value);
    }

    modalOptions.visible = true;
  };

  const handleCalendarPanelChange = async (date: DateUtil) => {
    calendarLoading.value = true;
    arrangedCalendar.value = await getCalendar({ year: date.year(), month: date.month() + 1 });
    calendarLoading.value = false;
  };

  const handleSaveCalendarSetting = async () => {
    const isArranged = arrangedCalendar.value.find(
      (item) => item.date === selectedDate.value?.format('YYYY-MM-DD'),
    );

    if (
      !isArranged &&
      modalOptions.isRestDay === false &&
      isEqual(originalShiftsArr.value, shiftsArr.value)
    ) {
      return;
    }

    if (isArranged && Boolean(isArranged.isRest) === modalOptions.isRestDay) {
      if (isArranged.profile) {
        try {
          if (
            isEqual(
              JSON.parse(isArranged.profile).shifts,
              JSON.parse(JSON.stringify(shiftsArr.value)),
            )
          ) {
            return;
          }
        } catch {}
      } else {
        return;
      }
    }

    let isOk = false;
    if (isArranged) {
      isOk = await updateCalendar({
        id: isArranged.id,
        update: {
          isRest: modalOptions.isRestDay,
          profile: JSON.stringify({ shifts: shiftsArr.value }),
        },
      });
    } else {
      isOk = await addCalendar({
        add: {
          date: selectedDate.value?.format('YYYY-MM-DD'),
          year: selectedDate.value?.format('YYYY'),
          month: selectedDate.value?.format('MM'),
          day: selectedDate.value?.format('DD'),
          isRest: modalOptions.isRestDay,
          profile: JSON.stringify({ shifts: shiftsArr.value }),
        },
      });
    }
    if (isOk) {
      createMessage.success('保存成功');

      if (calendarDate.value) {
        calendarLoading.value = true;
        arrangedCalendar.value = await getCalendar({
          year: calendarDate.value.year(),
          month: calendarDate.value.month() + 1,
        });
        calendarLoading.value = false;
      }

      modalOptions.visible = false;
    }
  };
</script>
