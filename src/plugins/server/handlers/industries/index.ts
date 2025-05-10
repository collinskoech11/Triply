import { HttpResponse, http } from 'msw'
import { db } from '../../industries/db'

export const handlerIndustries = [
  http.get('/api/industries/products', () => {
    try {
      const industries = db.industries
  
      return HttpResponse.json(industries, { status: 200 })
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch industries' }, { status: 500 })
    }
  }),

  http.get('/api/industries/products/:id', ({ params }) => {
    const id = Number(params.id)
    try{
      
      const industry = db.industries.find(item => item.id === id)
  
      if (!industry)
        return HttpResponse.error()
  
      return HttpResponse.json(industry, { status: 200 })
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch industries' }, { status: 500 })
    }
  }),
]