import React, { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import FullLayout from './layouts/FullLayout'
import DefaultLayout from './layouts/DefaultLayout'
import UserLayout from "./layouts/UserLayout";


const LoginPage = React.lazy(() => import('./pages/Login'))
const RegisterPage = React.lazy(() => import('./pages/Register'))

const HomePage = React.lazy(() => import('./pages/Home'))
const AboutPage = React.lazy(() => import('./pages/About'))
const PostPage = React.lazy(() => import('./pages/Post'))

const UserHomePage = React.lazy(() => import('./pages/UserHome'))
const UserPostPage = React.lazy(() => import('./pages/UserPost'))
const UserAboutPage = React.lazy(() => import('./pages/UserAbout'))

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
    },
    {
      element: <UserLayout />,
      children: [
        {
          path: '/users',
          element: <LoadComponent component={UserHomePage} />
        },
        {
          path: '/users/about',
          element: <LoadComponent component={UserAboutPage} />
        },
        {
          path: '/users/posts',
          element: <LoadComponent component={UserPostPage} />
        }
      ]
    }
  ])
}

export { AllRoutes }
