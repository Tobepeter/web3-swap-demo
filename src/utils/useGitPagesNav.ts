import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useGitPagesNav = () => {
  const { search } = useLocation()
  const navigate = useNavigate()

  // TODO: 有一个很ugly的问题，就是如果一开始地址是 swap，会很短暂看到首页再跳转过去
  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const path = searchParams.get('path')

    if (path) {
      const decodedPath = decodeURIComponent(path)
      searchParams.delete('path')
      const remainingSearch = searchParams.toString()
      navigate({ pathname: decodedPath, search: remainingSearch }, { replace: true })
    }
  }, [search])
}
