import React, { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import FullLayout from './layouts/FullLayout'
import DefaultLayout from './layouts/DefaultLayout'

const LoginPage = React.lazy(() => import('./pages/Login'))
const RegisterPage = React.lazy(() => import('./pages/Register'))

const HomePage = React.lazy(() => import('./pages/Home'))
const AboutPage = React.lazy(() => import('./pages/About'))
const PostPage = React.lazy(() => import('./pages/Post'))

const loading = () => <div className="" />

export const LoadComponent = ({ component: Component }) => (
  <Suspense fallback={loading()}>
    <Component />
  </Suspense>
)

const AllRoutes = () => {
  return useRoutes([
    {
      element: <DefaultLayout />,
      children: [
        {
          path: '/login',
          element: <LoadComponent component={LoginPage} />
        },
        {
          path: '/register',
          element: <LoadComponent component={RegisterPage} />
        }
      ]
    },
    {
      element: <FullLayout />,
      children: [
        {
          path: '',
          element: <LoadComponent component={HomePage} />
        },
        {
          path: '/about',
          element: <LoadComponent component={AboutPage} />
        },
        {
          path: '/posts',
          element: <LoadComponent component={PostPage} />
        }
      ]
    }
  ])
}

export { AllRoutes }
