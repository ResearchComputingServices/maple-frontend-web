import { SetStateAction } from 'react'

export interface ObjectResponse {
  label: string
  value: string
  bgcolor: string
}

export interface IModelType {
  uuid: string
  createDate: string
  name: string
  type: string
  bgcolor: string
}

export interface IModelIteration {
  uuid: string
  createDate: string
  modifyDate: string
  name: string
  type: string
  article_trained: string
  article_classified: string
  bgcolor: string
}

export interface AppContextProps {
  modelType: Array<ObjectResponse>
  setModelType: (modelType: Array<ObjectResponse>) => void
  modelIteration: Array<ObjectResponse>
  setModelIteration: (modelIteration: Array<ObjectResponse>) => void
  topicList: Array<ObjectResponse>
  setTopicList: (topicList: Array<ObjectResponse>) => void
  articleSummary: string
  setArticleSummary: (articleSummary: string) => void
  topicSummary: string
  setTopicSummary: (topicSummary: string) => void
  dotChart: any
  setDotChart: (dotChart: any) => void
  allDots: any
  setAllDots: (allDots: any) => void
  lineChart: any
  setLineChart: (lineChart: any) => void
}

export interface ReactChildren {
  children: React.ReactNode
}

export interface PostModel {
  id: number
  value: string
}
