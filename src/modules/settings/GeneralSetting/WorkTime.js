import ScheduleTable from '@components/common/table/ScheduleTable';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React, { useEffect } from 'react';
import { daysOfWeekSchedule as daysOfWeekScheduleOptions, daysTimeLabel } from '@constants/masterData';
import dayjs from 'dayjs';
import { BaseForm } from '@components/common/form/BaseForm';
import { useForm } from 'antd/es/form/Form';
import { Button, Col, Row } from 'antd';
import { STATUS_ACTIVE, TIME_FORMAT_DISPLAY } from '@constants';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { SaveOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { actions } from '@store/actions/app';
const WorkTime = ({ data, executeUpdate, mixinFuncs, executeGetDataSetting }) => {
    const translate = useTranslate();
    const daysOfWeekSchedule = translate.formatKeys(daysOfWeekScheduleOptions, ['label']);
    const TimeLabel = translate.formatKeys(daysTimeLabel, ['label']);
    const workTimeData = data[0];
    const [form] = useForm();
    const dispatch = useDispatch();
    function convertDataObject(data) {
        const result = {};
        const keys = ['2', '3', '4', '5', '6', '7', '8'];

        keys.forEach((key) => {
            if (Object.hasOwnProperty.call(data, key)) {
                result[key] = data[key];
            }
        });

        // Split time and update missing fields
        Object.keys(result).forEach((key) => {
            const timeArray = [
                { from: result[key]?.am?.[0], to: result[key]?.am?.[1] },
                { from: result[key]?.pm?.[0], to: result[key]?.pm?.[1] },
            ];
            result[key] = timeArray;
        });

        return result;
    }

    const splitTime = (data) => {
        const result = {};
        const dataNew = {
            monday: data['2'],
            tuesday: data['3'],
            wednesday: data['4'],
            thursday: data['5'],
            friday: data['6'],
            saturday: data['7'],
            sunday: data['8'],
        };

        for (const key in dataNew) {
            if (Object.hasOwn(dataNew, key)) {
                const value = dataNew[key];
                if (value && value.length > 0) {
                    result[key] = dataNew[key];
                }
            }
        }

        return result;
    };

    useEffect(() => {
        const initializeDefaultSchedule = () => {
            let defaultSchedule = {};
            daysOfWeekSchedule.forEach((day) => {
                defaultSchedule[day.value] = [
                    { from: dayjs('00:00', 'HH:mm'), to: dayjs('00:00', 'HH:mm') },
                    { from: dayjs('00:00', 'HH:mm'), to: dayjs('00:00', 'HH:mm') },
                ];
            });
            return defaultSchedule;
        };
        const dataTime = workTimeData?.valueData && workTimeData?.valueData && JSON.parse(workTimeData?.valueData);
        let data =
            workTimeData?.valueData && workTimeData?.valueData != {}
                ? splitTime(convertDataObject(dataTime))
                : initializeDefaultSchedule();

        // if (data) {
        //     const dataFullFrame = addFrameTime(data);
        // }
        let dataDefault = {};
        daysOfWeekSchedule.map((day) => {
            dataDefault = {
                [day.value]: [
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                ],
                ...dataDefault,
            };
        });
        for (const day in data) {
            for (const timeRange of data[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }
        for (const day in dataDefault) {
            for (const timeRange of dataDefault[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }

        form.setFieldsValue({
            schedule: data || dataDefault,
        });
    }, [workTimeData]);

    function formatTimeRange(timeArray) {
        return { am: [timeArray[0].from, timeArray[0].to], pm: [timeArray[1].from, timeArray[1].to] };
    }
    const handleSubmit = (values) => {
        for (const day in values.schedule) {
            for (const timeRange of values.schedule[day]) {
                timeRange.from = timeRange.from.set({ hour: 0, minute: 0 }).format('HH[H]mm');
                timeRange.to = timeRange.to.set({ hour: 0, minute: 0 }).format('HH[H]mm');
            }
        }
        const newSchedule = {
            2: formatTimeRange(values.schedule.monday),
            3: formatTimeRange(values.schedule.tuesday),
            4: formatTimeRange(values.schedule.wednesday),
            5: formatTimeRange(values.schedule.thursday),
            6: formatTimeRange(values.schedule.friday),
            7: formatTimeRange(values.schedule.saturday),
            8: formatTimeRange(values.schedule.sunday),
        };
        const filterNewSchedule = Object.entries(newSchedule)
            .filter(([key, value]) => value !== '')
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
        values.schedule = values.schedule && JSON.stringify(filterNewSchedule);
        executeUpdate({
            data: {
                id: data?.[0]?.id,
                status: STATUS_ACTIVE,
                valueData: values?.schedule,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    executeGetDataSetting({
                        onCompleted: (response) => {
                            const dataSetting = response?.data;
                            dispatch(actions.settingSystem(dataSetting));
                        },
                    });

                    showSuccessMessage(translate.formatMessage(commonMessage.workingTimeSuccess));
                }
            },
            onError: (err) => {
                showErrorMessage('error');
            },
        });
    };

    const handleTimeChange = (fieldName, value) => {
        if (!value) {
            try {
                const schedule = form.getFieldValue('schedule');
                const [dayKey, dayIndexKey, frameKey] = fieldName;
                if (frameKey === 'from') {
                    schedule[dayKey][dayIndexKey].from = dayjs('00:00', 'HH:mm');
                } else if (frameKey === 'to') {
                    schedule[dayKey][dayIndexKey].to = dayjs('00:00', 'HH:mm');
                    // schedule[dayKey][dayIndexKey].to = schedule[dayKey][dayIndexKey].from;
                }
                form.setFieldValue('schedule', schedule);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const onSelectScheduleTabletRandom = (fieldName, value) => {
        try {
            const schedule = form.getFieldValue('schedule');
            const [dayKey, dayIndexKey, frameKey] = fieldName;
            if (frameKey === 'from') {
                const to = schedule[dayKey][dayIndexKey].to;
                if (to && to.format(TIME_FORMAT_DISPLAY) < value.format(TIME_FORMAT_DISPLAY)) {
                    // schedule[dayKey][dayIndexKey].to = value;
                }
            } else if (frameKey === 'to') {
                const from = schedule[dayKey][dayIndexKey].from;
                if (from && value.format(TIME_FORMAT_DISPLAY) < from.format(TIME_FORMAT_DISPLAY)) {
                    value = from;
                }
            }
            schedule[dayKey][dayIndexKey][frameKey] = value;
            form.setFieldValue('schedule', schedule);
        } catch (error) {
            console.log(error);
        }
    };
    const handleApplyAll = (e) => {
        e.preventDefault();
        const schedule = form.getFieldValue('schedule');
        const { monday = [] } = schedule;

        for (let { value } of daysOfWeekSchedule) {
            schedule[value] = monday.map((frame) => ({
                from: dayjs(frame.from, TIME_FORMAT_DISPLAY),
                to: dayjs(frame.to, TIME_FORMAT_DISPLAY),
            }));
        }
        // form.resetFields();
        form.setFieldValue('schedule', schedule);
    };
    const handleReset = (day) => {
        const schedule = form.getFieldValue('schedule');
        for (let dayIndexKey = 0; dayIndexKey < 3; dayIndexKey++) {
            schedule[day][dayIndexKey].from = dayjs('00:00', 'HH:mm');
            schedule[day][dayIndexKey].to = dayjs('00:00', 'HH:mm');
        }
        form.setFieldValue('schedule', schedule);
    };

    return (
        <div>
            <BaseForm form={form} size="750px" onFinish={(values) => handleSubmit(values)}>
                <ScheduleTable
                    // handleOk={handleOk}
                    timeLabel={TimeLabel}
                    onSelectScheduleTabletRandom={onSelectScheduleTabletRandom}
                    translate={translate}
                    handleApplyAll={handleApplyAll}
                    daysOfWeekSchedule={daysOfWeekSchedule}
                    handleTimeChange={handleTimeChange}
                    handleReset={handleReset}
                />

                <Row justify="end" gutter={12} style={{ marginTop: '10px' }}>
                    <Col>
                        <Button key="submit" htmlType="submit" type="primary" icon={<SaveOutlined />}>
                            {translate.formatMessage(commonMessage.save)}
                        </Button>
                    </Col>
                </Row>
            </BaseForm>
        </div>
    );
};

export default WorkTime;
