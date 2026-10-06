import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { ApplicationProvider } from '@/features/application/ApplicationProvider'
import ApplicationHistory from '@/pages/app/ApplicationHistory'
import Dashboard from '@/pages/app/Dashboard'
import Notifications from '@/pages/app/Notifications'
import Profile from '@/pages/app/Profile'
import TrackApplication from '@/pages/app/TrackApplication'
import MyApplications from '@/pages/app/MyApplications'
import VerifyIdentity from '@/pages/app/VerifyIdentity'
import ApplyStep from '@/pages/apply/ApplyStep'
import GetStarted from '@/pages/apply/GetStarted'
import LoanPackages from '@/pages/apply/LoanPackages'
import Submitted from '@/pages/apply/Submitted'
import Login from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import VerifyOtp from '@/pages/auth/VerifyOtp'

export default function App() {
  return (
    <ApplicationProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyOtp />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-identity" element={<VerifyIdentity />} />
          <Route path="/loan-packages" element={<LoanPackages />} />
          <Route path="/apply" element={<GetStarted />} />
          <Route path="/application-submitted" element={<Submitted />} />
          <Route path="/track" element={<TrackApplication />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/history" element={<ApplicationHistory />} />
          <Route path="/settings" element={<Navigate to="/profile" replace />} />
        </Route>

        <Route path="/apply/:step" element={<ApplyStep />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ApplicationProvider>
  )
}
