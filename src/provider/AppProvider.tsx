'use client'

import { AppContextProps, ReactChildren } from 'app/_types'
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

// ==========================
// ==== DEV EXPERIMENTAL ====
function _getSummaryData() {
  const d = new Date();
  return d.toISOString() + ' ' + _getRandomStr(50);
}

function _getRandomStr(length: any) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function _getChartData() {
  d3.csv(
    'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv',
  ).then(function (data) {
    console.log(data)
    return data;
  })
}

async function _delay(t: any) {
  return new Promise(res => {
    setTimeout(res, t)
  })
}

let dotChartData = [{ country: "USA", gold: 10, silver: 20 },
{ country: "China", gold: 20, silver: 100 },
{ country: "India", gold: 200, silver: 50 },
{ country: "Russia", gold: 25, silver: 80 },
{ country: "Germany", gold: 10, silver: 200 },
{ country: "UK", gold: 150, silver: 75 },
{ country: "France", gold: 10, silver: 70 },
{ country: "UAE", gold: 30, silver: 150 },
{ country: "Canada", gold: 100, silver: 15 }]

function _preFormatChartData(datum: any) {
  const _chartData: any = [];
  datum['date'].forEach((element: any, index: any) => {
    _chartData.push({ 'date': element.split('T')[0], 'count': datum['count'][index] })
  });
  return _chartData;
}

// const useRecursiveTimeout = (callback : any, delay = 5000) => {
//   const ref = useRef();

//   useEffect(() => {
//     ref.current = callback;
//   });

//   useEffect(() => {
//     const tick = () => {
//       const ret = ref.current();

//       const nextDelay = 5000;
//       if (!ret) {
//         setTimeout(tick, nextDelay);
//       } else if (ret.constructor === Promise) {
//         ret.then(() => setTimeout(tick, nextDelay));
//       }
//     };

//     const timer = setTimeout(tick, delay);

//     return () => clearTimeout(timer);
//   }, [delay]);
// };
// ==== DEV EXPERIMENTAL ====
// ==========================

// Create the context
export const AppContext = createContext({} as AppContextProps)

// Create a custom hook to use the context.
export function useAppContext() {
  return useContext(AppContext)
}

/**
 * The AppProvider component.
 */
export default function AppProvider({ children }: ReactChildren) {
  // const [modelType, setModelType] = useState([{ uuid: 'NA', createDate: 'NA', name: 'NA', type: 'NA', bgcolor: 'light' }])
  const [modelType, setModelType] = useState([{ value: 'DEFAULT', label: 'Loading...', bgcolor: 'light' }])
  const [modelIteration, setModelIteration] = useState([{ value: 'DEFAULT', label: 'Loading...', bgcolor: 'light' }])
  const [topicList, setTopicList] = useState([{ value: 'DEFAULT', label: 'Loading...', bgcolor: 'light' }])
  const [articleSummary, setArticleSummary] = useState('Loading...')
  const [topicSummary, setTopicSummary] = useState('Loading...')
  const [dotChart, setDotChart] = useState<any>('Loading')
  const [allDots, setAllDots] = useState<any>('Loading')
  const [lineChart, setLineChart] = useState<any>('Loading')

  // Fetch the data on mount.
  useEffect(() => {
    // Model Type
    async function searchModelType() {
      try {
        let newData: any = [];
        const response = await fetch(`/api/modeltype`)
        const data = await response.json()
        for (const key in data.result) {
          newData[key] = {
            label: data.result[key]['name'],
            value: data.result[key]['uuid'],
            bgcolor: 'light'
          }
        }
        console.log(">> appprovider-modeltype:", newData)
        // setModelType(newData)
        return newData;
      } catch (error) {
        console.error(error)
      }
    }

    // Model Iteration for model type
    async function searchModelIteration() {
      try {
        let newData: any = [];
        const response = await fetch(`/api/modeliteration`)
        const data = await response.json()
        // for (const key in data.result) {
        //   newData[key] = {
        //     label: data.result[key]['name'] + '_' + data.result[key]['createDate'], 
        //     value: data.result[key]['uuid'],
        //     bgcolor: 'light'
        //   }
        // }
        newData[0] = {
          label: data.result[0]['name'] + '_' + data.result[0]['createDate'],
          value: data.result[0]['uuid'],
          bgcolor: 'light'
        }
        console.log(">> appprovider-modeliteration:", newData)
        // setModelIteration(newData)
        return newData
      } catch (error) {
        console.error(error)
      }
    }

    // Topic list for model iteration
    async function searchModelTopic(uid: string) {
      try {
        let newData: any = {};
        const response = await fetch(`/api/topiclist/?uuid=${uid}`)
        const data = await response.json()
        for (const key1 in data['result']) {
          console.log('key1', key1)

          newData['model_level1'] = [];
          for (const key2 in data['result'][key1]['model_level1']['topic']) {
            console.log('model_level1 key2', key2)
            newData['model_level1'].push({
              uuid: data['result'][key1]['model_level1']['topic'][key2]['uuid'],
              label: 'Level1_' + data['result'][key1]['model_level1']['topic'][key2]['label'],
              value: data['result'][key1]['model_level1']['topic'][key2]['name'],
              summary: data['result'][key1]['model_level1']['topic'][key2]['dot_summary'].join(', '),
              bgcolor: 'light',
              chart: _preFormatChartData(data['result'][key1]['model_level1']['topic'][key2]['chart']['over_time']['1D'])
            })
          }

          newData['model_level2'] = [];
          for (const key3 in data['result'][key1]['model_level2']['topic']) {
            console.log('model_level2 key3', key3)
            newData['model_level2'].push({
              uuid: data['result'][key1]['model_level2']['topic'][key3]['uuid'],
              label: 'Level2_' + data['result'][key1]['model_level2']['topic'][key3]['label'],
              value: data['result'][key1]['model_level2']['topic'][key3]['name'],
              summary: data['result'][key1]['model_level2']['topic'][key3]['dot_summary'].join(', '),
              bgcolor: 'light',
              chart: _preFormatChartData(data['result'][key1]['model_level2']['topic'][key3]['chart']['over_time']['1D'])
            })
          }

          newData['model_level3'] = [];
          for (const key4 in data.result[key1]['model_level3']['topic']) {
            console.log('model_level3 key4', key4)
            newData['model_level3'].push({
              uuid: data['result'][key1]['model_level3']['topic'][key4]['uuid'],
              label: 'Level3_' + data.result[key1]['model_level3']['topic'][key4]['label'],
              value: data.result[key1]['model_level3']['topic'][key4]['name'],
              summary: data.result[key1]['model_level3']['topic'][key4]['dot_summary'].join(', '),
              bgcolor: 'light',
              chart: _preFormatChartData(data['result'][key1]['model_level3']['topic'][key4]['chart']['over_time']['1D'])
            })
          }
        }

        // console.log(">> appprovider-topiclist:", newData)
        // setTopicList(newData)
        return newData
      } catch (error) {
        console.error(error)
      }
    }

    // Processed
    async function searchProcessedIteration(uid: string) {
      try {
        let newData: any = {};
        const response = await fetch(`/api/processed/?uuid=${uid}`)
        const data = await response.json()
        newData['alldots'] = [];
        for (const key in data.result) {
          newData['alldots'].push({
            xPos: data.result[key]['position'][0],
            yPos: data.result[key]['position'][1],
            color: '#999999'
          })

          if(!newData.hasOwnProperty(data.result[key]['topic_level1']['uuid'])){
            newData[data.result[key]['topic_level1']['uuid']] = [];
          }
          newData[data.result[key]['topic_level1']['uuid']].push({
            xPos: data.result[key]['position'][0],
            yPos: data.result[key]['position'][1],
            color: '#'+data.result[key]['topic_level1']['uuid'].substring(0, 6)
          })
          if(!newData.hasOwnProperty(data.result[key]['topic_level2']['uuid'])){
            newData[data.result[key]['topic_level2']['uuid']] = [];
          }
          newData[data.result[key]['topic_level2']['uuid']].push({
            xPos: data.result[key]['position'][0],
            yPos: data.result[key]['position'][1],
            color: '#'+data.result[key]['topic_level2']['uuid'].substring(0, 6)
          })
          if(!newData.hasOwnProperty(data.result[key]['topic_level3']['uuid'])){
            newData[data.result[key]['topic_level3']['uuid']] = [];
          }
          newData[data.result[key]['topic_level3']['uuid']].push({
            xPos: data.result[key]['position'][0],
            yPos: data.result[key]['position'][1],
            color: '#'+data.result[key]['topic_level3']['uuid'].substring(0, 6)
          })
        }
        console.log(">> appprovider-processed:", newData)
        // setModelType(newData)
        return newData;
      } catch (error) {
        console.error(error)
      }
    }

    // let timer = setTimeout(() => console.log("Delay Invoked: level-1"), 1000);

    const id = setInterval(async function () {
      const _modelType = await searchModelType()
      const _modelIteration = await searchModelIteration()

      for (let i = 0; i < _modelType.length; i++) {
        for (let z = 0; z < _modelType.length; z++) {
          _modelType[z]['bgcolor'] = 'light';
        }
        _modelType[i]['bgcolor'] = 'success';
        setModelType(_modelType)
        await _delay(5000)

        for (let j = 0; j < _modelIteration.length; j++) {
          for (let z = 0; z < _modelIteration.length; z++) {
            _modelIteration[z]['bgcolor'] = 'light';
          }
          _modelIteration[j]['bgcolor'] = 'success';
          setModelIteration(_modelIteration)
          await _delay(5000)

          const _topicList = await searchModelTopic(_modelIteration[j]['value'])
          const _processedIteration = await searchProcessedIteration(_modelIteration[j]['value'])
          
          // all dots
          if(_processedIteration.hasOwnProperty('alldots')) {
            setAllDots(_processedIteration['alldots']);
          }
          
          //model_level1
          for (let k = 0; k < _topicList['model_level1'].length; k++) {
            for (let z = 0; z < _topicList['model_level1'].length; z++) {
              _topicList['model_level1'][z]['bgcolor'] = 'light';
            }
            _topicList['model_level1'][k]['bgcolor'] = 'success';
            setTopicList(_topicList['model_level1'])
            setTopicSummary(_topicList['model_level1'][k]['summary'])
            if(_processedIteration.hasOwnProperty(_topicList['model_level1'][k]['uuid'])) {
              setDotChart(_processedIteration[_topicList['model_level1'][k]['uuid']]);
            }
            setLineChart(_topicList['model_level1'][k]['chart']);
            await _delay(5000)
          }

          //model_level2
          for (let k = 0; k < _topicList['model_level2'].length; k++) {
            for (let z = 0; z < _topicList['model_level2'].length; z++) {
              _topicList['model_level2'][z]['bgcolor'] = 'light';
            }
            _topicList['model_level2'][k]['bgcolor'] = 'success';
            setTopicList(_topicList['model_level2'])
            setTopicSummary(_topicList['model_level2'][k]['summary'])
            if(_processedIteration.hasOwnProperty(_topicList['model_level2'][k]['uuid'])) {
              setDotChart(_processedIteration[_topicList['model_level2'][k]['uuid']]);
            }
            setLineChart(_topicList['model_level2'][k]['chart']);
            await _delay(5000)
          }

          //model_level3
          for (let k = 0; k < _topicList['model_level3'].length; k++) {
            for (let z = 0; z < _topicList['model_level3'].length; z++) {
              _topicList['model_level3'][z]['bgcolor'] = 'light';
            }
            _topicList['model_level3'][k]['bgcolor'] = 'success';
            setTopicList(_topicList['model_level3'])
            setTopicSummary(_topicList['model_level3'][k]['summary'])
            if(_processedIteration.hasOwnProperty(_topicList['model_level3'][k]['uuid'])) {
              setDotChart(_processedIteration[_topicList['model_level3'][k]['uuid']]);
            }
            setLineChart(_topicList['model_level3'][k]['chart']);
            await _delay(5000)
          }

        }
      }


      // d3.csv(
      //   'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv',
      // ).then(function (data) {
      //   setDotChart(data);
      // })

      // setModelType(_modelType)
      // await _delay(5000)



      // console.log('new date', new Date())
      // console.log('_getRandomStr', _getRandomStr(10))
      // dotChartData[2]['country'] = _getRandomStr(10)
      // console.log('dotChartData111', dotChartData)
      // setDotChart(dotChartData);

    }, 240000);

    // on Unmount
    return () => {
      clearInterval(id);
      // clearTimeout(timer);
    }

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{
      modelType,
      setModelType,
      modelIteration,
      setModelIteration,
      topicList,
      setTopicList,
      articleSummary,
      setArticleSummary,
      topicSummary,
      setTopicSummary,
      dotChart,
      setDotChart,
      allDots,
      setAllDots,
      lineChart,
      setLineChart
    }}>
      {children}
    </AppContext.Provider>
  )
}