'use client'
// Version A: the Admin settings screens, merged in from the separate "PowerMatch Design Lab" app.
// The four pages were routes there (/settings/…); here the sidebar switches between them as views.
import { useState, type ComponentType } from 'react'
import { SettingsShell } from './parts/settings-shell'
import NumbersAndHoursPage from './pages/numbers-hours'
import QueuesAndWrapUpPage from './pages/queues-wrap-up'
import UserManagementPage from './pages/user-management'
import ComplianceDataPage from './pages/compliance-data'

const pages: Record<string, ComponentType> = {
  'numbers-hours': NumbersAndHoursPage,
  'queues-wrap-up': QueuesAndWrapUpPage,
  'user-management': UserManagementPage,
  'compliance-data': ComplianceDataPage,
}

export default function VariantA() {
  const [view, setView] = useState('numbers-hours')
  const Page = pages[view]
  return (
    <SettingsShell view={view} onNav={setView}>
      <Page key={view} />
    </SettingsShell>
  )
}
