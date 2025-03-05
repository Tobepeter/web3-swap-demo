import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useGitPagesNav = () => {
  const { search } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // NOTE: localhost也需要方便测试
    // const isGithubPages = window.location.origin.includes('github.io')
    // if (!isGithubPages) {
    //   return
    // }

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
