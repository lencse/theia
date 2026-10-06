import { tmpdir } from 'node:os'
import { createServerFn } from '@tanstack/react-start'

export const getTmpDir = createServerFn({ method: 'GET' }).handler(async () => tmpdir())
