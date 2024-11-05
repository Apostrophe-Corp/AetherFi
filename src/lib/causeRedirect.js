'use server'

import { redirect } from 'next/navigation'

export const causeRedirect = (x) => redirect(x)
