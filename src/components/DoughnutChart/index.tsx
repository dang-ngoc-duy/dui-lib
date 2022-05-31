import React, { useEffect, useRef, useState } from 'react';
import ReactEcharts, { EChartsOption } from 'echarts-for-react';
import { ECharts } from 'echarts';
import clsx from 'clsx';

import doughnutChartStyle from './style';
import { formatNumberV2 } from '../../utils';
import TooltipBase from 'components/Tooltip';

const colorList = [
    '#0d30c4','#eb0029','#ec9124','#1f93f6','#1a9b06',
    '#af09af','#f35353','#b6c400','#7d37f8','#08b573',
    '#10c5bf','#9f5a00','#026b13','#f951ee','#800567',
    '#0664a2','#69b21b','#60f3f8','#dc749b','#1569d8',
    '#f2d206','#0096a1','#071180','#6fe553','#7707ae',
];

export type DoughnutChartIconType =
    | 'circle'
    | 'square'
    | 'rect'
    | 'roundRect'
    | 'triangle'
    | 'diamond'
    | 'pin'
    | 'arrow'
    | 'none';

export interface DoughnutChartData {
    key?: string;
    name: string;
    value: number;
    // color: string;
}

export interface DoughnutChartProps {
    // Chart
    size?: string | number;
    width?: string;
    height?: string;
    insideRadius?: string;
    outsideRadius?: string;
    insideChildRadius?: string;
    outsideChildRadius?: string;
    hasChildChart?: boolean;
    horizontalAlign?: string;
    verticalAlign?: string;
    scaleSize?: number;
    justifyContent?: 'left' | 'center' | 'right';

    //Label
    labelType?: 'total' | 'outside' | 'inside' | 'center';
    labelValueType?: 'percent' | 'number';
    labelFontSize?: string | number;
    valueFontSize?: string | number;

    labelCenterSize?: string | number;
    valueCenterSize?: string | number;

    labelEmptySize?: string | number;
    valueEmptySize?: string | number;

    //Legend
    legendIconType?: DoughnutChartIconType;
    legendTextColor?: string;
    // legendLineHeight?: number;
    // legendOrient?: 'vertical' | 'horizontal';
    // legendMarginTop?: number;
    // legendMarginRight?: number;
    legendPosition?: 'left' | 'right' | 'bottom' | 'top' | 'left-right';
    legendSplit?: number;
    legenDecorUnderLine?: boolean;
    legendValueType?: 'number' | 'percent' | 'text';
    legendVisibleValue?: boolean;
    legendVisibleTitle?: boolean;
    legendVisibleSubfix?: boolean;
    legendCheckDataFetching?: boolean;

    isShortLegend?: boolean;

    chartData: DoughnutChartData[];
    chartBgColor?: string;
    totalValue?: string;
    totalLabel?: string;
    callBackLegendClick?(idx: number, value: number, name: string, key?: string): void;
    className?: string;
    labelLineHeight?: number;
}

const DoughnutChart: React.FunctionComponent<DoughnutChartProps> = (props) => {
    const classes = doughnutChartStyle();
    const {
        size,
        width,
        height,
        insideRadius,
        outsideRadius,
        insideChildRadius,
        outsideChildRadius,
        hasChildChart = false,
        horizontalAlign,
        verticalAlign,
        scaleSize, // Thay đổi kích thước series khi hover (same same 'hoverOffset' - ver 4.9.0)
        justifyContent,
        chartData,
        chartBgColor,
        labelType,
        labelValueType,
        labelFontSize,
        labelCenterSize,
        // labelEmptySize,
        valueFontSize,
        valueCenterSize,
        // valueEmptySize,
        // legendIconType,
        // legendLineHeight,
        // legendOrient,
        // legendMarginTop,
        // legendMarginRight,
        legendPosition,
        legendSplit,
        legenDecorUnderLine,
        legendValueType,
        legendVisibleValue,
        legendVisibleTitle=true,
        legendCheckDataFetching,
        totalValue,
        totalLabel,
        callBackLegendClick,
        className,
        isShortLegend,
        labelLineHeight,
        legendVisibleSubfix = true,
    } = props;

    const chartRef = useRef<ReactEcharts>(null);
    const [chart, setChart] = useState<ECharts>();
    const [emptyChart, setEmptyChart] = useState<boolean>(false);
    const [leftLegend, setLeftLegend] = useState<DoughnutChartData[]>();
    const [rightLegend, setRightLegend] = useState<DoughnutChartData[]>();
    const [rightStartIdx, setRightStartIdx] = useState<number>();
    const [tValue, setTValue] = useState<number>(0);
    const [tAbsValue, setTAbsValue] = useState<number>(0);
    const [tUnModifyValue, setTUnModifyValue] = useState<number>(0);
    const [currLegend, setCurrLegend] = useState<number>();
    const serieList = chartData?.map((item, idx) => {
        return {
            value: isNaN(item.value) ? 0 : item.value,
            name: item.name,
            label: (labelType === 'outside' || labelType === 'total' )
                    ? {color: colorList[idx]}
                    : undefined,
        };
    });

    const negativeList = chartData.filter(item => item.value < 0);
    const arrtemp = chartData.filter(item => item.value > 0);
    [...chartData].reverse().forEach(item => {
        if(item.value < 0){
            arrtemp.unshift(item);
        }
    })

    const handleLegendClick = (idx: number, value: number, name: string, key?: string) => {
        //console.log(name)
        // chart?.dispatchAction({
        //     type: 'highlight',
        //     dataIndex: [idx]
        // })
        if(legendCheckDataFetching === undefined || !legendCheckDataFetching)
        {
            setCurrLegend(idx)
            callBackLegendClick && callBackLegendClick(idx, value, name, key);
        }
    }

    const labelOpt = () => {
        switch(labelType){
            case 'inside':
                return { normalShow: true, emphasisShow: true, position: 'inside'};
            case 'outside':
                return { normalShow: true, emphasisShow: true, position: 'outside'};
            case 'center':
                return { normalShow: false, emphasisShow: chartData.length === 1 ? false : true, position: 'center'};
            case 'total':
                return { normalShow: true, emphasisShow: true, position: 'outside' };
            default:
                return { normalShow: false , emphasisShow: false };
        }
    }

    const splitLegendCSS = () => {
        let cssStr = '';
        if(legendSplit){
            for(let i=1; i<=legendSplit; i++){
                cssStr += 'auto ';
            }
        }
        return {
            display: 'grid',
            gridTemplateColumns: cssStr,
            justifyContent: legendValueType === 'text' ? 'start' : 'space-around',
            justifyItems: legendPosition !== 'left' ? 'start' : 'end',
            '& li':{
                color: 'red'
            },
            '&::before':{
                display: chartData.length === 0 ? "none" : 'inline-block'
            }
        } as React.CSSProperties;
    }

    const renderTotalValue = () => {
        return(
            <div className='total'>
                <span style={{
                    fontWeight: 'bold',
                    fontSize: valueFontSize ? valueFontSize : undefined
                }}>
                {
                    // totalValue || (chartData.length === 1 && (labelValueType === 'percent' 
                    // ? formatNumberV2(chartData[0].value) + '%' 
                    // : formatNumberV2(chartData[0].value)))

                    totalValue || (chartData.length === 1 && (labelValueType === 'percent' 
                    ? (
                        (chartData[0].value/(tValue)*100) < 0 ? "0.00" : (!isNaN(chartData[0].value/(tValue)*100)
                        ? (chartData[0].value/(tValue)*100).toFixed(2) : "0.00")
                    ) + '%' 
                    : formatNumberV2(chartData[0].value)))
                }
                </span>
                <label style={{textAlign: 'center', color: '#353535',
                    fontSize: labelFontSize ? labelFontSize : undefined,
                    marginTop: chartData && chartData.length === 1 ? '14px' : undefined
                }}>{totalLabel || (chartData.length === 1 && chartData[0].name.split('-')[1])}</label>
            </div>
        )
    }

    const renderEmptyValue = () => {
        // return(
        //     <div className='empty'>
        //         <span style={{
        //             fontWeight: 'bold',
        //             fontSize: valueEmptySize ? valueEmptySize : undefined
        //         }}>-</span>
        //         <label style={{
        //             fontSize: labelEmptySize ? labelEmptySize : undefined
        //         }}>Chưa có dữ liệu</label>
        //     </div>
        // )
    }

    const renderChart = () => {
        return (
            <>
                <div id='chart-root' className='chart-center'></div>
                <ReactEcharts
                    ref={chartRef}
                    className={clsx('chart-base', className)}
                    style={{
                        width: width ? width : (size ? size : '300px'),
                        height: height ? height : (size ? size : '300px'),
                        display: 'flex',
                    }}
                    option={{ ...option, color: [...colorList] }}
                />
                {!emptyChart ? (labelType === 'total' || chartData.length === 1 ? renderTotalValue() : null) : renderEmptyValue()}
            </>
        )
    }

    const renderLeftLegend = () => {
        return (
            <>
                {legendPosition === 'left' ? (
                    <div className='legend-left'>
                        <ul style={legendSplit ? splitLegendCSS() : undefined}>
                            {chartData
                                ? chartData.map((item, idx) => (
                                    <li key={idx}>
                                        {legendVisibleValue ? (
                                            <span className='value'>
                                                {legendValueType === 'number'
                                                    ? ((item.value || item.value >= 0)
                                                        ? formatNumberV2(item.value)
                                                        : (item.value < 0 ? '['+formatNumberV2(item.value)+']' : '-'))
                                                    : legendValueType === 'percent' ? 
                                                        ((item.value || item.value >= 0) ? formatNumberV2(item.value)  + '%': '-') 
                                                    : ''}
                                            </span>
                                        ) : null}
                                        <span
                                            onMouseOut={()=>{
                                                chart?.dispatchAction({
                                                    type: 'downplay',
                                                    seriesIndex: item.value < 0 ? 1 : 0,
                                                    dataIndex: item.value < 0
                                                        ? negativeList.findIndex(i => i.name === item.name) : [idx]
                                                })
                                            }}
                                            onMouseOver={()=>{
                                                chart?.dispatchAction({
                                                    type: 'highlight',
                                                    seriesIndex: item.value < 0 ? 1 : 0,
                                                    dataIndex: item.value < 0
                                                        ? negativeList.findIndex(i => i.name === item.name) : [idx]
                                                })
                                            }}
                                            onClick={() => handleLegendClick(idx, item.value, item.name, item.key)}
                                            className={clsx('name', isShortLegend ? "shortLegend" : "")} style={{color: colorList[idx]}}>
                                            <label className={idx === currLegend ? 'active' : undefined} style={{textDecoration: legenDecorUnderLine
                                                ? 'underline' : undefined}}>
                                                {isShortLegend
                                                    ? legendValueType === 'number' || !legendVisibleValue
                                                        ? item.name.split('-')[1] + ' [' +
                                                            ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                ? (item.value/(tValue)*100).toFixed(2) : '-') + '%]'
                                                        : legendValueType === 'percent' ? item.name.split('-')[1] : item.name
                                                    : legendValueType === 'number' || !legendVisibleValue
                                                        ? item.name + ' [' +
                                                            ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                ? (item.value/(tValue)*100).toFixed(2) : '-') + '%]'
                                                        : item.name
                                                }
                                            </label>
                                        </span>
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                ) : legendPosition === 'left-right' ? (
                    <div className='legend-left'>
                        <ul style={legendSplit ? splitLegendCSS() : undefined}>
                            {leftLegend
                                ? leftLegend.map((item, idx) => (
                                    <li key={idx}>
                                            {legendVisibleValue ? (
                                                <span className='value'>
                                                {legendValueType === 'number'
                                                    ? ((item.value || item.value >= 0)
                                                        ? (item.value < 0
                                                            ? clsx('[' + formatNumberV2(item.value) + ']', hasChildChart ? '[' + formatNumberV2((Math.abs(item.value) / (tAbsValue) * 100).toFixed(2)) + '%]' : '')
                                                            : clsx(formatNumberV2(item.value), hasChildChart ? '[' + formatNumberV2((Math.abs(item.value) / (tAbsValue) * 100).toFixed(2)) + '%]' : ''))
                                                        : '-')
                                                    : legendValueType === 'percent' ? ((item.value || item.value >= 0)
                                                        ? formatNumberV2(item.value) + '%'
                                                        : '-') 
                                                    : ''
                                                }
                                                </span>
                                            ) : null}
                                        <span
                                            onMouseOut={()=>{
                                                chart?.dispatchAction({
                                                    type: 'downplay',
                                                    seriesIndex: item.value < 0 ? 1 : 0,
                                                    dataIndex: item.value < 0
                                                        ? negativeList.findIndex(i => i.name === item.name) : [idx]
                                                })
                                            }}
                                            onMouseOver={()=>{
                                                chart?.dispatchAction({
                                                    type: 'highlight',
                                                    seriesIndex: item.value < 0 ? 1 : 0,
                                                    dataIndex: item.value < 0
                                                        ? negativeList.findIndex(i => i.name === item.name) : [idx]
                                                })
                                            }}
                                            onClick={() => handleLegendClick(idx, item.value, item.name, item.key)}
                                            className={clsx('name', isShortLegend ? "shortLegend" : "")} style={{color: colorList[idx]}}>
                                            <label className={idx === currLegend ? 'active' : undefined} style={{textDecoration: legenDecorUnderLine
                                                ? 'underline' : undefined}}>
                                                {isShortLegend
                                                    ? legendValueType === 'number' || !legendVisibleValue
                                                        ? item.name.split('-')[1] + ' [' +
                                                            ((item.value/(tValue)*100) < 0 ? '0,00' : !isNaN(item.value/(tValue)*100)
                                                                ? (item.value/(tValue)*100).toFixed(2) : '-') + '%]'
                                                        : legendValueType === 'percent' ? item.name.split('-')[1] : item.name
                                                    : legendValueType === 'number' || !legendVisibleValue
                                                        ? item.name + ' [' +
                                                            ((item.value/(tValue)*100) < 0 ?  hasChildChart ? formatNumberV2((item.value/(tUnModifyValue)*100).toFixed(2)) :'0,00' : !isNaN(item.value/(tValue)*100)
                                                            ? formatNumberV2((item.value/(hasChildChart ? tUnModifyValue : tValue)*100).toFixed(2)) : '-') + '%]'
                                                        : item.name
                                                }
                                            </label>
                                        </span>
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                ) : null}
            </>
        )
    }

    const renderRightLegend = () => {
        return (
            <>
                {legendPosition === 'right' ? (
                    <div className='legend-right'>
                        <ul style={legendSplit ? splitLegendCSS() : undefined}>
                            {chartData
                                ? chartData.map((item, idx) => (
                                        <li key={idx}>
                                            {legendVisibleValue ? (
                                                <span className='value'>{legendValueType === 'number'
                                                    ? ((item.value || item.value >= 0)
                                                        ? (item.value < 0 ? '['+formatNumberV2(item.value)+']' : formatNumberV2(item.value)) : '-')
                                                    : legendValueType === 'percent' ? ((item.value || item.value >= 0)
                                                        ? formatNumberV2(item.value)  + '%' : '-') : '' }
                                                </span>
                                            ) : null}
                                            <span
                                                onMouseOut={()=>{
                                                    chart?.dispatchAction({
                                                        type: 'downplay',
                                                        seriesIndex: item.value < 0 ? 1 : 0,
                                                        dataIndex: item.value < 0
                                                            ? negativeList.findIndex(i => i.name === item.name) : [idx]
                                                    })
                                                }}
                                                onMouseOver={()=>{
                                                    chart?.dispatchAction({
                                                        type: 'highlight',
                                                        seriesIndex: item.value < 0 ? 1 : 0,
                                                        dataIndex: item.value < 0
                                                            ? negativeList.findIndex(i => i.name === item.name) : [idx]
                                                    })
                                                }}
                                                onClick={() => handleLegendClick(idx, item.value, item.name, item.key)}
                                                className={clsx('name', isShortLegend ? "shortLegend" : "")} style={{color: colorList[idx], maxWidth: '110px'}}>
                                                    <TooltipBase 
                                                        title = {
                                                                isShortLegend
                                                                    ? legendValueType === 'number' || !legendVisibleValue
                                                                        ? item.name.split('-')[1]  + ' [' +
                                                                            ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                                ? formatNumberV2((item.value/(tValue)*100).toFixed(2)) : '-') + '%]'
                                                                        : legendValueType === 'percent' ? item.name.split('-')[1] : item.name
                                                                    : legendValueType === 'number' || !legendVisibleValue
                                                                        ? item.name  + ' [' +
                                                                            ((item.value/(tValue)*100) < 0 ? '0.00': !isNaN(item.value/(tValue)*100)
                                                                                ? formatNumberV2((item.value/(tValue)*100).toFixed(2)) : '-') + '%]'
                                                                        : item.name
                                                                } 
                                                        arrow 
                                                        placement="top"
                                                    >
                                                        <label className={idx === currLegend ? 'active' : undefined} style={{textDecoration: legenDecorUnderLine
                                                            ? 'underline' : undefined}}>
                                                                {isShortLegend
                                                                    ? legendValueType === 'number' || !legendVisibleValue
                                                                        ? item.name.split('-')[1]  + ' [' +
                                                                            ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                                ? formatNumberV2((item.value/(tValue)*100).toFixed(2)) : '-') + '%]'
                                                                        : legendValueType === 'percent' ? item.name.split('-')[1] : item.name
                                                                    : legendValueType === 'number' || !legendVisibleValue
                                                                        ? item.name  + ' [' +
                                                                            ((item.value/(tValue)*100) < 0 ? '0.00': !isNaN(item.value/(tValue)*100)
                                                                                ? formatNumberV2((item.value/(tValue)*100).toFixed(2)) : '-') + '%]'
                                                                        : item.name
                                                                }
                                                        </label>
                                                    </TooltipBase>
                                            </span>
                                        </li>
                                    ))
                                : null}
                        </ul>
                    </div>
                ) : legendPosition === 'left-right' ? (
                    <div className='legend-full-right'>
                        <ul style={legendSplit ? splitLegendCSS() : undefined}>
                            {rightLegend
                                ? rightLegend.map((item, idx) => {
                                    let rLeng = rightStartIdx;
                                    let index = rLeng ? idx + rLeng : idx;
                                    return(
                                        <li key={index}>
                                            {legendVisibleValue ? (
                                                <span className='value'>  
                                                    {legendValueType === 'number'  //CHINH SUA THEO MIs
                                                        ? ((item.value)  // || item.value >= 0 Need?
                                                            // ? (item.value < 0 ? '['+formatNumberV2(item.value)+']' : formatNumberV2(item.value)) : '-')
                                                            ? (item.value < 0
                                                                ? clsx('[' + formatNumberV2(item.value) + ']', hasChildChart ? '[' + formatNumberV2((Math.abs(item.value) / (tAbsValue) * 100).toFixed(2)) + '%]' : '')
                                                                : clsx(formatNumberV2(item.value), hasChildChart ? '[' + formatNumberV2((Math.abs(item.value) / (tAbsValue) * 100).toFixed(2)) + '%]' : '')) 
                                                            : '-') // % tri tuyet doi
                                                        : legendValueType === 'percent' ? ((item.value || item.value >= 0)
                                                            ? formatNumberV2(item.value) + '%' 
                                                            : '-') : ''
                                                    }
                                                </span>
                                            ) : null}
                                            <span
                                                onMouseOut={()=>{
                                                    chart?.dispatchAction({
                                                        type: 'downplay',
                                                        seriesIndex: item.value < 0 ? 1 : 0,
                                                        dataIndex: item.value < 0
                                                            ? negativeList.findIndex(i => i.name === item.name) : [index]
                                                    })
                                                }}
                                                onMouseOver={()=>{
                                                    chart?.dispatchAction({
                                                        type: 'highlight',
                                                        seriesIndex: item.value < 0 ? 1 : 0,
                                                        dataIndex: item.value < 0
                                                            ? negativeList.findIndex(i => i.name === item.name) : [index]
                                                    })
                                                }}
                                                onClick={() => handleLegendClick(index, item.value, item.name, item.key)}
                                                className={clsx('name', isShortLegend ? "shortLegend" : "")} style={{color: colorList[index]}}>
                                                <label className={index === currLegend ? 'active' : undefined} style={{textDecoration: legenDecorUnderLine
                                                    ? 'underline' : undefined}}>
                                                        {isShortLegend
                                                            ? legendValueType === 'number' || !legendVisibleValue
                                                                ? item.name.split('-')[1]  + ' [' +
                                                                    ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                        ? (item.value/(tValue)*100).toFixed(2) : '-') + '%]'
                                                                : legendValueType === 'percent' ? item.name.split('-')[1] : item.name
                                                            : legendValueType === 'number' || !legendVisibleValue
                                                                ? item.name  + ' [' +
                                                                    ((item.value/(tValue)*100) < 0 ? hasChildChart ? formatNumberV2((item.value/(tUnModifyValue)*100).toFixed(2)) :'0.00' : !isNaN(item.value/(tValue)*100)  //Hien Thi so % so am
                                                                        ? formatNumberV2((item.value/(hasChildChart ? tUnModifyValue : tValue)*100).toFixed(2)) : '-') + '%]'
                                                                : item.name
                                                        }
                                                </label>
                                            </span>
                                        </li>
                                    )
                                }) : null}
                        </ul>
                    </div>
                ) : null}
            </>
        )
    }

    const renderTopLegend = () => {
        return (
            <>
                {legendPosition === 'top' ? (
                    <div className='legend-top'>
                        <ul style={legendSplit ? splitLegendCSS() : undefined}>
                            {chartData
                                ? chartData.map((item, idx) => (
                                    <li key={idx}>
                                        {legendVisibleValue ? (
                                            <span className='value'>{legendValueType === 'number'
                                                ? ((item.value || item.value >= 0)
                                                    ? (item.value < 0 ? '['+formatNumberV2(item.value)+']' : formatNumberV2(item.value)) : '-')
                                                : ((item.value || item.value >= 0)
                                                    ? formatNumberV2(item.value)  + '%' : '-')}
                                            </span>
                                        ) : null}
                                        <span
                                            onMouseOut={()=>{
                                                chart?.dispatchAction({
                                                    type: 'downplay',
                                                    dataIndex: [idx]
                                                })
                                            }}
                                            onMouseOver={()=>{
                                                chart?.dispatchAction({
                                                    type: 'highlight',
                                                    dataIndex: [idx]
                                                })
                                            }}
                                            onClick={() => handleLegendClick(idx, item.value, item.name, item.key)}
                                            className='name' style={{color: colorList[idx]}}>
                                            <label className={idx === currLegend ? 'active' : undefined} style={{textDecoration: legenDecorUnderLine
                                                ? 'underline' : undefined}}>
                                                    {isShortLegend
                                                        ? legendValueType === 'number' || !legendVisibleValue
                                                            ? item.name.split('-')[1]  + ' [' +
                                                                ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                    ? (item.value/(tValue)*100).toFixed(2) : '-') + '%]'
                                                            : item.name.split('-')[1]
                                                        : legendValueType === 'number' || !legendVisibleValue
                                                            ? item.name  + ' [' +
                                                                ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                    ? (item.value/(tValue)*100).toFixed(2) : '-') + '%]'
                                                            : item.name
                                                    }
                                            </label>
                                        </span>
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                ) : null}
            </>
        )
    }

    const renderBottomLegend = () => {
        return(
            <>
                {legendPosition === 'bottom' ? (
                    <div className={clsx(legendVisibleTitle ? 'legend-bottom' : 'legend-bottom no-title', chartData.length === 0 ? 'emptyNote' : '' )}>
                        <ul style={legendSplit ? splitLegendCSS() : undefined} className={chartData.length === 0 ? 'emptyNote' : '' }>
                            {chartData
                                ? chartData.map((item, idx) => (
                                        <li  key={idx} className={ legendVisibleValue ? 'withValue' : ''}>
                                            {legendVisibleValue ? (
                                                <span className='value'>{legendValueType === 'number'
                                                    ? ((item.value || item.value >= 0)
                                                        ? (item.value < 0 ? '['+formatNumberV2(item.value)+']' : formatNumberV2(item.value)) : '-')
                                                    : ((item.value || item.value >= 0)
                                                        ? formatNumberV2(item.value)  + '%' : '-')}
                                                </span>
                                            ) : null}
                                            <span
                                                onMouseOut={()=>{
                                                    chart?.dispatchAction({
                                                        type: 'downplay',
                                                        dataIndex: [idx]
                                                    })
                                                }}
                                                onMouseOver={()=>{
                                                    chart?.dispatchAction({
                                                        type: 'highlight',
                                                        dataIndex: [idx]
                                                    })
                                                    chart?.dispatchAction({
                                                        type:'unselected',
                                                        dataIndex: [idx],
                                                        name: item.name
                                                    })
                                                }}
                                                onClick={() => handleLegendClick(idx, item.value, item.name, item.key)}
                                                className='name' style={{color: colorList[idx]}}>
                                                <label className={idx === currLegend ? 'active' : undefined} style={{textDecoration: legenDecorUnderLine
                                                    ? 'underline' : undefined}}>
                                                        {isShortLegend
                                                            ? (legendValueType === 'number' || !legendVisibleValue) && legendVisibleSubfix
                                                                ? item.name.split('-')[1]  + ' [' +
                                                                    ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                        ? formatNumberV2((item.value/(tValue)*100).toFixed(2)) : '-') + '%]'
                                                                : item.name.split('-')[1]
                                                            : (legendValueType === 'number' || !legendVisibleValue) && legendVisibleSubfix
                                                                ? item.name  + ' [' +
                                                                    ((item.value/(tValue)*100) < 0 ? '0.00' : !isNaN(item.value/(tValue)*100)
                                                                        ? formatNumberV2((item.value/(tValue)*100).toFixed(2)) : '-') + '%]'
                                                                : item.name
                                                        }
                                                </label>
                                            </span>
                                        </li>
                                    ))
                                : null}
                        </ul>
                    </div>
                ) : null}
            </>
        )
    }

    // const legendList = chartData?.map((item) => {
    //     return {
    //         name: item.name,
    //         icon: legendIconType ? legendIconType : 'square',
    //     };
    // });

    const option: EChartsOption = {
        renderer: 'canvas',
        graphic: [
            {
                type: 'group',
                rotation: Math.PI / 4,
                bounding: 'raw',
                left: '50%',
                top: '50%',
                z: 1,
                children: [
                    {
                        type: 'circle',
                        left: 'center',
                        top: 'center',
                        z: 1,
                        scaleY: 1,
                        scalex: 1,
                        style: {
                            fill: !emptyChart ? (chartBgColor ? chartBgColor :  '#FFF') : 'transparent', // Mau nen chart
                        },
                        shape: {
                            r: insideRadius ? insideRadius.replace('px', '').trim() : '115' // size nen cua chart
                        }
                    }
                ]
            },
            {
                type: 'group',
                rotation: 0,
                bounding: 'raw',
                left: '50%',
                top: '50%',
                z: 0,
                children: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'top',
                        z: 0,
                        style: {
                            textAlign: 'center',
                            fill: !emptyChart ? (chartData.length === 1 ? 'rgb(115,115,115)' : 'transparent') : 'rgb(115,115,115)',
                            // fill: !chartData || chartData.length === 0 ? 'rgb(115,115,115)' : 'transparent',
                            text: 'Chưa có dữ liệu',
                            font: '14px "roboto",sans-serif'
                        }
                    },
                    {
                        type: 'text',
                        left: 'center',
                        top: 'bottom',
                        z: 0,
                        style: {
                            textAlign: 'center',
                            fill: !emptyChart ? (chartData.length === 1 ? '#000' : 'transparent') : '#000',
                            text: '-',
                            font: 'Bold 25px "roboto",sans-serif'
                        },
                    },
                ]
            }
        ],
        //backgroundColor: '#FFFFFF',
        // legend: {
        //     show: false,
        //     itemGap: legendLineHeight ? legendLineHeight : 15,
        //     type: 'scroll',
        //     orient: legendOrient ? legendOrient : 'vertical',
        //     right: legendMarginRight ? legendMarginRight : '20%',
        //     top: legendMarginTop ? legendMarginTop : '35%',
        //     textStyle: {},
        //     data: legendList,
        // },
        series: hasChildChart ? [
            {
                name: 'Doughnut Chart',
                type: 'pie',
                data: emptyChart ? [] : serieList,
                //data: serieList,
                avoidLabelOverlap: true,
                // selectedMode: 'single',
                // selectedOffset: 10,
                scaleSize: scaleSize ? scaleSize : 5, // version 5.0.0 trở lên, thay cho 'hoverOffset'
                stillShowZeroSum: true,
                cursor: 'pointer',
                // top: 'middle',
                showEmptyCircle: true,
                emptyCircleStyle:{
                    color: 'lightgray'
                },
                radius: [
                    insideRadius ? insideRadius : '115px',
                    outsideRadius ? outsideRadius : '140px',
                ],
                center: [
                    horizontalAlign ? horizontalAlign : '50%',
                    verticalAlign ? verticalAlign : '50%',
                ],
                label: {
                    show: labelOpt()?.normalShow, // true => show default name: 'Doughnut Chart'
                    position: labelOpt()?.position, // shows the description data to center, turn off to show in right side
                    fontSize: valueFontSize ? valueFontSize : 18,
                    fontFamily: 'roboto',
                    padding: [0, 0, 20,0],  //fix chart neg loi empasis re-center
                    overflow: 'none',
                    // ellipsis: '...',
                    //color: 'rgba(0, 0, 0, 0.5)',
                    // formatter: '{percent|{d}%}\n',
                    formatter: function(value: any) {
                        
                        const reCalcValue = (value.value/tUnModifyValue) * 100;

                        return `{percent|${formatNumberV2(reCalcValue.toFixed(2))}%}`;
                        // return `{percent|${value}%}\n}`
                    },
                        rich: {
                            percent: {
                         
                            //color: 'rgba(0, 0, 0, 0.5)',
                            align: 'center',
                            verticalAlign: 'center',
                            fontSize: 18,
                            fontFamily: 'roboto',
                            //fontWeight: 'bold',
                        },
                    },
                },
                emphasis: {
                    label:{
                        show: labelOpt()?.emphasisShow,
                        fontSize: valueFontSize ? valueFontSize : 19,
                        fontFamily: 'roboto',
                        overflow: 'none',
                        padding: [0, 0, 20,0],  //fix chart neg loi empasis re-center
                        // ellipsis: '...',
                        //color: 'rgba(0, 0, 0, 0.5)',
                        //* {b}: name, {c}: value, {d}: value(percent)',
                        formatter: labelType === 'center'
                            ? ( labelValueType === 'percent'
                                ? '{percent|{c}%\n}  {name|{b}}'
                                : '{number|{c}} \n\n {name|{b}}')
                            : undefined,

                        // style custom
                        rich: {
                            number: {
                                align: 'center',
                                verticalAlign: 'center',
                                fontSize: valueCenterSize ? valueCenterSize : 19,
                                fontWeight: 'bold',
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: '1.2',
                                letterSpacing: 'normal',
                                textAlign: 'center',
                                color: labelType === 'center' ? '#353535' : undefined,
                            },
                            percent: {
                                align: 'center',
                                verticalAlign: 'center',
                                fontSize: valueCenterSize ? valueCenterSize : 19,
                                fontWeight: 'bold',
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: '1.2',
                                letterSpacing: 'normal',
                                textAlign: 'center',
                                color: labelType === 'center' ? '#353535' : undefined,
                            },
                            name: {
                                align: 'center',
                                verticalAlign: 'center',
                                fontSize: labelCenterSize ? labelCenterSize : '20',
                                fontWeight: 'normal',
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: '1.2',
                                letterSpacing: 'normal',
                                textAlign: 'center',
                                top: 20,
                                color: '#707070',
                            },
                        },
                    },
                    itemStyle:{
                        shadowBlur: 10,
                        shadowOffsetX: 2,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                },
                labelLine: {
                    show: true,
                    length: 20,
                    length2: 0,
                    lineStyle: {
                        // color ,
                        // width ,
                        // type ,
                        //dashOffset,
                        // cap ,
                        // join ,
                        // miterLimit ,
                        // shadowBlur ,
                        // shadowColor ,
                        // shadowOffsetX ,
                        // shadowOffsetY ,
                        // opacity
                    },
                },
                labelLayout: (params: any) => {
                    if(chart){
                        const isLeft = params.labelRect.x < chart.getWidth() / 2;
                        const points = params.labelLinePoints as number[][];

                        // Update the end point.
                        if(points){
                            points[2][0] = isLeft
                            ? params.labelRect.x
                            : params.labelRect.x + params.labelRect.width;
                        }

                        return {
                            draggable: true,
                            labelLinePoints: points
                        };
                    }
                    return params;
                },
            },
            {
                name: 'Child Chart',
                type: 'pie',
                //stillShowZeroSum: true,
                showEmptyCircle: false,
                avoidLabelOverlap: true,
                radius: [
                    insideChildRadius ? insideChildRadius : '90px',
                    outsideChildRadius ? outsideChildRadius : insideRadius,
                ],
                data: arrtemp?.map(item => {
                    if(item.value < 0){
                        return {
                            value: Math.abs(item.value), 
                            itemStyle: {
                                color: colorList[chartData.findIndex(i => i.name === item.name)]
                            },
                            emphasis: {
                                label:{
                                    show: true,
                                    fontSize: valueFontSize ? valueFontSize : 19,
                                    fontFamily: 'roboto',
                                    overflow: 'none',
                                    padding: [0, 0, 20,0],  //fix chart neg loi empasis re-center
                                    // ellipsis: '...',
                                    //color: 'rgba(0, 0, 0, 0.5)',
                                    //* {b}: name, {c}: value, {d}: value(percent)',
                                    formatter: labelType === 'center'
                                        ? ( labelValueType === 'percent'
                                            ? '{percent|{c}%\n}  {name|{b}}'
                                            : '{number|{c}} \n\n {name|{b}}')
                                        : undefined,
            
                                    // style custom
                                    rich: {
                                        number: {
                                            align: 'center',
                                            verticalAlign: 'center',
                                            fontSize: valueCenterSize ? valueCenterSize : 19,
                                            fontWeight: 'bold',
                                            fontStretch: 'normal',
                                            fontStyle: 'normal',
                                            lineHeight: '1.2',
                                            letterSpacing: 'normal',
                                            textAlign: 'center',
                                            color: labelType === 'center' ? '#353535' : undefined,
                                        },
                                        percent: {
                                            align: 'center',
                                            verticalAlign: 'center',
                                            fontSize: valueCenterSize ? valueCenterSize : 19,
                                            fontWeight: 'bold',
                                            fontStretch: 'normal',
                                            fontStyle: 'normal',
                                            lineHeight: '1.2',
                                            letterSpacing: 'normal',
                                            textAlign: 'center',
                                            color: labelType === 'center' ? '#353535' : undefined,
                                        },
                                        name: {
                                            align: 'center',
                                            verticalAlign: 'center',
                                            fontSize: labelCenterSize ? labelCenterSize : '20',
                                            fontWeight: 'normal',
                                            fontStretch: 'normal',
                                            fontStyle: 'normal',
                                            lineHeight: '1.2',
                                            letterSpacing: 'normal',
                                            textAlign: 'center',
                                            top: 20,
                                            color: '#707070',
                                        },
                                    },
                                },
                                itemStyle:{
                                    shadowBlur: 10,
                                    shadowOffsetX: 2,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                }
                            },
                            label: {
                                show: true,
                                emphasisShow: true, 
                                position: 'outside',
                                fontSize: valueFontSize ? valueFontSize : 18,
                                fontFamily: 'roboto',
                                padding: [0, 0, 20,0],  //fix chart neg loi empasis re-center
                                overflow: 'none',
                                formatter: function(value: any) {
                                    const reCalcValue = (value.value/tUnModifyValue) * 100;
                                    return `{percent|-${formatNumberV2(reCalcValue.toFixed(2))}%}`;
                                },
                                rich: {
                                    percent: {
                                        align: 'center',
                                        verticalAlign: 'center',
                                        fontSize: 18,
                                        fontFamily: 'roboto',
                                        color: colorList[chartData.findIndex(i => i.name === item.name)]
                                    },
                                },
                            },
                            labelLine: {
                                show: true,
                                length: 45,
                                length2: 0,
                            },
                        }
                    }else{
                        return {value: item.value, itemStyle: {
                            color: 'rgba(255, 255, 255, 0)'}
                        }
                    }
                }),
                labelLayout: (params: any) => {
                    if(chart){
                        const isLeft = params.labelRect.x < chart.getWidth() / 2;
                        const points = params.labelLinePoints as number[][];

                        // Update the end point.
                        if(points){
                            points[2][0] = isLeft
                            ? params.labelRect.x
                            : params.labelRect.x + params.labelRect.width;
                        }

                        return {
                            draggable: true,
                            labelLinePoints: points
                        };
                    }
                    return params;
                },
            },
        ] : [
            {
                name: 'Doughnut Chart',
                type: 'pie',
                data: emptyChart ? [] : serieList,
                //data: serieList,
                avoidLabelOverlap: true,
                // selectedMode: 'single',
                // selectedOffset: 10,
                scaleSize: scaleSize ? scaleSize : 5, // version 5.0.0 trở lên, thay cho 'hoverOffset'
                stillShowZeroSum: false,
                cursor: 'pointer',
                // top: 'middle',
                showEmptyCircle: true,
                emptyCircleStyle:{
                    color: 'lightgray'
                },
                radius: [
                    insideRadius ? insideRadius : '115px',
                    outsideRadius ? outsideRadius : '140px',
                ],
                center: [
                    horizontalAlign ? horizontalAlign : '50%',
                    verticalAlign ? verticalAlign : '50%',
                ],
                label: {
                    show: labelOpt()?.normalShow, // true => show default name: 'Doughnut Chart'
                    position: labelOpt()?.position, // shows the description data to center, turn off to show in right side
                    fontSize: valueFontSize ? valueFontSize : 18,
                    fontFamily: 'roboto',
                    overflow: 'none',
                    padding: [0, 0, 20,0],  //fix chart neg loi empasis re-center
                    // ellipsis: '...',
                    //color: 'rgba(0, 0, 0, 0.5)',
                    // formatter: '{percent|{d}%}\n', // fix number format
                    formatter: function(value: any) {                        
                        const reCalcValue = value.value/tValue * 100;
                        return `{percent|${formatNumberV2(reCalcValue.toFixed(2))}%}`;
                        // return `{percent|${value}%}\n}`
                    },
                        rich: {
                            percent: {
                            //color: 'rgba(0, 0, 0, 0.5)',
                            align: 'center',
                            verticalAlign: 'center',
                            fontSize: 18,
                            fontFamily: 'roboto',
                            //fontWeight: 'bold',
                        },
                    },
                },
                emphasis: {
                    label:{
                        show: labelOpt()?.emphasisShow,
                        fontSize: valueFontSize ? valueFontSize : 19,
                        fontFamily: 'roboto',
                        padding: [0, 0, 20,0],  //fix chart neg loi empasis re-center
                        overflow:  labelType === 'total' ? 'none' : 'break',
                        width: isShortLegend ? Number(insideRadius?.replace('px', '').trim()) * 1.5 : undefined,
                        //color: 'rgba(0, 0, 0, 0.5)',
                        //* {b}: name, {c}: value, {d}: value(percent)',
                        // formatter: labelType === 'center'
                        //     ? ( labelValueType === 'percent'
                        //         ? '{percent|{c}%} \n\n {name|{b}}'
                        //         : '{number|{c}} \n\n {name|{b}}')
                        //     : undefined,
                        formatter: ((props: any) =>{
                            let prcent = props?.percent ? props.percent.toString().replace("." , ",") : "0";
                            let number = props?.value ? props.value.toString() : "0";

                            return  labelType === 'center'
                            ? ( isShortLegend && labelValueType === 'percent' ?
                                `{percent|${prcent}%} \n {name|${props.name.split('-')[1]}}` 
                                : (labelValueType === 'percent' ? 
                                `{percent|${prcent}%} \n {name|${props.name}}`
                                : `\n\n {number|${formatNumberV2(number)}} \n\n {name|${props.name}}`))
                            : undefined
                        }),

                        // style custom
                        rich: {
                            number: {
                                align: 'center',
                                verticalAlign: 'center',
                                fontSize: valueCenterSize ? valueCenterSize : 19,
                                fontWeight: 'bold',
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: '1.2',
                                letterSpacing: 'normal',
                                textAlign: 'center',
                                color: labelType === 'center' ? '#353535' : undefined,
                            },
                            percent: {
                                align: 'center',
                                verticalAlign: 'center',
                                fontSize: valueCenterSize ? valueCenterSize : 19,
                                fontWeight: 'bold',
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                lineHeight: 42,
                                letterSpacing: 'normal',
                                textAlign: 'center',
                                color: labelType === 'center' ? '#353535' : undefined,
                            },
                            name: {
                                align: 'center',
                                verticalAlign: 'center',
                                fontSize: labelCenterSize ? labelCenterSize : '20',
                                fontWeight: 'normal',
                                fontStretch: 'normal',
                                fontStyle: 'normal',
                                letterSpacing: 'normal',
                                textAlign: 'center',
                                top: 15,
                                overflow: 'hidden',
                                textTransform:'ellipsis',
                                lineHeight: labelLineHeight ? labelLineHeight : undefined,
                            },

                        },
                    },
                    itemStyle:{
                        shadowBlur: 10,
                        shadowOffsetX: 2,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                },
                labelLine: {
                    show: chartData.length === 1  ? false : true,
                    length: 20,
                    length2: 0,
                    lineStyle: {
                        // color ,
                        // width ,
                        // type ,
                        // dashOffset ,
                        // cap ,
                        // join ,
                        // miterLimit ,
                        // shadowBlur ,
                        // shadowColor ,
                        // shadowOffsetX ,
                        // shadowOffsetY ,
                        // opacity
                    },
                },
                labelLayout: (params: any) => {
                    if(chart){
                        const isLeft = params.labelRect.x < chart.getWidth() / 2;
                        const points = params.labelLinePoints as number[][];

                        // Update the end point.
                        if(points){
                            points[2][0] = isLeft
                            ? params.labelRect.x
                            : params.labelRect.x + params.labelRect.width;
                        }

                        return {
                            draggable: true,
                            labelLinePoints: points
                        };
                    }
                    return params;
                },
            },
        ],
        // tooltip: {
        //     show: true,
        //     trigger: 'item',
        //     formatter: '{b}: ({d}%)',
        // },
    };

    // eslint-disable-next-line
    useEffect(()=>{
        if(chartRef.current){
            const chartRoot = chartRef.current.getEchartsInstance();
            setChart(chartRoot);

            //     if(chart){
            //         // let chartOpt: EChartsOption = chart.getOption();
            //     //     if(chartOpt){
            //     //         // chart.on('mouseover', 'series', (item: any)=>{
            //     //         //     console.log(item)
            //     //         //     // chart.dispatchAction({
            //     //         //     //     type: 'highlight',
            //     //         //     //     dataIndex: [item.dataIndex]
            //     //         //     // })
            //     //         // })
            //     //         // chart.on('click', 'series', (item: any)=>{
            //     //         //     console.log(item)
            //     //         //     // console.log(item)
            //     //         //     // chart.dispatchAction({
            //     //         //     //     type: 'highlight',
            //     //         //     //     dataIndex: [item.dataIndex]
            //     //         //     // })
            //     //         // })
            //     //     }
            //     }
        }
        // let canvas = document.querySelector('.chart-center>.chart-base>div>canvas') as HTMLCanvasElement;
        // let test = canvas.getContext('2d') as CanvasRenderingContext2D ;
    },[])

    useEffect(()=>{
        //if(tValue === 0 ) return;
        let chartTotalValue = 0;
        let chartAbsTotalValue = 0;
        let chartUnModTotalValue = 0;
        chartData.forEach(item => {
            if(item.value > 0){  //Lay Tong Theo Mis
                chartTotalValue += item.value;
            }
            chartAbsTotalValue += Math.abs(item.value);
            chartUnModTotalValue += item.value;

        });
        setTAbsValue(chartAbsTotalValue);
        setTUnModifyValue(chartUnModTotalValue);
        setTValue(chartTotalValue);

        // chartData.map(item => {
        //     if(item.value < 0){
        //         setNegativeList(s => [...s, item.value])
        //     }
        // })

        if(chartTotalValue === 0 || chartTotalValue === undefined || isNaN(chartTotalValue)){
            setEmptyChart(true);
        }else{
            setEmptyChart(false);
        }

        if(legendPosition === 'left-right'){

            let rightLen = (chartData.length - (chartData.length % 2)) / 2;
            let leftLen = chartData.length - rightLen;

            setLeftLegend(chartData.slice(0,leftLen)); 
            setRightLegend(chartData.slice(leftLen));
            setRightStartIdx(leftLen);
        }
    // eslint-disable-next-line
    },[chartData])

    return (
        <div
            className={clsx(classes.root, className)}
            style={{justifyContent: justifyContent ? justifyContent : 'center'}}
        >
            {legendPosition === 'left' || legendPosition === 'right'|| legendPosition === 'left-right' ? (
                <div className={legendPosition === 'left-right' ? 'left-right' : 'one-side' }>
                    {renderLeftLegend()}
                    {renderChart()}
                    {renderRightLegend()}
                </div>
            ) : (
                <div className='top-bottom'>
                    {renderTopLegend()}
                    {renderChart()}
                    {renderBottomLegend()}
                </div>
            )}
        </div>
    );
};

export default DoughnutChart;