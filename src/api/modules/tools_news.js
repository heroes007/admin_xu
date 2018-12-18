import api from './config'

export function get_list(param){
  return api.post('/api/tools_news/get_list',{
        page_index:param.page_index,
        page_size:param.page_size,
        state:param.state
        });
}

export function get_detail(news_id){
  return api.post('/api/tools_news/get_detail',{news_id:news_id});
}

export function add_news(param){
  return api.post('/api/tools_news/add_news',{
        title:param.title,
        description:param.description,
        content:param.content,
        default_count:param.default_count
        });
}

export function update_news(param){
  return api.post('/api/tools_news/update_news',{
        news_id:param.news_id,
        title:param.title,
        description:param.description,
        content:param.content,
        default_count:param.default_count,
        state:param.state
        });
}
