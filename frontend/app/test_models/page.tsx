 'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useTheme } from '@/hooks'

export default function TestModelsPage() {
  const { theme, mounted, toggleTheme } = useTheme()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    let mountedFetch = true
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/test_models')
        const json = await res.json()
        if (mountedFetch) setData(json)
      } catch (e) {
        // ignore
      }
    }

    fetchResults()
    const id = setInterval(fetchResults, 2000)
    return () => { mountedFetch = false; clearInterval(id) }
  }, [])

  const logRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!data || !data.logs || !logRef.current) return
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [data?.logs])

  // compute some simple timing stats for the results (avg/median/min/max per-page)
  const timeStats = useMemo(() => {
    const results: any[] = (data && data.results) || []
    const allTimes: number[] = results.map((r: any) => (r && r.time ? Number(r.time) : null)).filter(Boolean) as number[]
    if (allTimes.length === 0) return null

    const overall = (() => {
      const sum = allTimes.reduce((a, b) => a + b, 0)
      const avg = sum / allTimes.length
      const sorted = [...allTimes].sort((a,b) => a-b)
      const median = (sorted.length % 2 === 1) ? sorted[(sorted.length-1)/2] : (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
      const min = sorted[0]
      const max = sorted[sorted.length-1]
      return { count: allTimes.length, avg, median, min, max }
    })()

    // per-model times array
    const perModelTimes: Record<string, number[]> = {}
    results.forEach((r: any) => {
      if (!r || !r.time) return
      const m = r.model || 'unknown'
      if (!perModelTimes[m]) perModelTimes[m] = []
      perModelTimes[m].push(Number(r.time))
    })

    const perModelStats: Record<string, {count:number, avg:number, median:number, min:number, max:number}> = {}
    Object.entries(perModelTimes).forEach(([m, arr]) => {
      const sorted = [...arr].sort((a,b) => a-b)
      const sum = arr.reduce((a,b) => a + b, 0)
      const avg = sum / arr.length
      const median = (sorted.length % 2 === 1) ? sorted[(sorted.length-1)/2] : (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
      perModelStats[m] = { count: arr.length, avg, median, min: sorted[0], max: sorted[sorted.length-1] }
    })

    return { overall, perModel: perModelStats }
  }, [data])

  // Wait for theme hook to mount to avoid mismatch
  if (!mounted) return null

  return (
  <div className={'test-models-container flex-1 bg-gray-100 dark:bg-gray-900 transition-colors min-h-screen py-6 px-4'}>
      <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/datasense-logo.svg" alt="DataSense" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Model test results</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">For developers — accessible via direct URL only</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">Theme: <span className="font-medium text-gray-900 dark:text-white">{theme}</span></div>
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm shadow-green-900/10 dark:shadow-md dark:shadow-black/20"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          {!data || data.message === 'no-results' ? (
            <div className="text-center py-12 text-gray-500">No results yet. Run the `test_models.py` script to POST results.</div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-500">Last received: {data.received_at} {data.state ? `· ${data.state}` : ''}</div>
                <div className="text-xs text-gray-500">Results: {data.results ? data.results.length : 0}</div>
              </div>

              {data.logs && data.logs.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Live log</div>
                  <div ref={logRef} className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded p-3 text-xs font-mono text-gray-700 dark:text-gray-300 scrollbar-thin scrollbar-thumb-green-500 dark:scrollbar-thumb-green-400 scrollbar-track-green-100 dark:scrollbar-track-green-900/20 hover:scrollbar-thumb-green-600 dark:hover:scrollbar-thumb-green-300">
                    {data.logs.map((ln: any, i: number) => (
                      <div key={i} className="whitespace-pre-wrap">{String(ln)}</div>
                    ))}
                  </div>

                  {/* Time statistics below the live log */}
                  <div className="mt-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded p-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Execution time statistics</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Last: {data?.received_at || '-'}</div>
                    </div>
                    {!timeStats ? (
                      <div className="text-xs">No timing data available yet.</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded p-3 flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Overall</div>
                            <div className="text-2xl font-semibold mt-2">{(data?.summary && Object.values(data.summary).reduce((a: any, b: any) => a + (b.success||0), 0)) || 0}/{(data?.summary && Object.values(data.summary).reduce((a: any, b: any) => a + (b.count||0), 0)) || 0}</div>
                            <div className="text-xs text-gray-500 mt-1">successful</div>
                          </div>
                          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded p-3 flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400">llama3:8b</div>
                            <div className="text-2xl font-semibold mt-2">{(data?.summary?.['llama3:8b']?.success ?? 0)}/{(data?.summary?.['llama3:8b']?.count ?? 0)}</div>
                            <div className="text-xs text-gray-500 mt-1">successful</div>
                          </div>
                          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded p-3 flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400">qwen2.5-coder</div>
                            <div className="text-2xl font-semibold mt-2">{(data?.summary?.['qwen2.5-coder']?.success ?? 0)}/{(data?.summary?.['qwen2.5-coder']?.count ?? 0)}</div>
                            <div className="text-xs text-gray-500 mt-1">successful</div>
                          </div>
                          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded p-3 flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Measured runs</div>
                            <div className="text-2xl font-semibold mt-2">{timeStats.overall.count}</div>
                            <div className="text-xs text-gray-500 mt-1">total</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded p-3">
                            <div className="text-sm font-semibold">Overall</div>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">Measured runs</div>
                            <div className="text-lg font-medium">{timeStats.overall.count}</div>
                            <div className="mt-3 text-xs">Avg <span className="font-semibold">{timeStats.overall.avg.toFixed(2)}s</span></div>
                            <div className="text-xs">Median <span className="font-semibold">{timeStats.overall.median.toFixed(2)}s</span></div>
                            <div className="text-xs">Min / Max <span className="font-semibold">{timeStats.overall.min.toFixed(2)}s</span> / <span className="font-semibold">{timeStats.overall.max.toFixed(2)}s</span></div>
                          </div>

                          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(timeStats.perModel).map(([m, v]: any) => {
                              const accent = m.toLowerCase().includes('qwen') ? 'from-purple-400 to-purple-600 text-purple-600 dark:text-purple-300' : 'from-green-400 to-green-600 text-green-600 dark:text-green-300'
                              const widthPct = timeStats.overall.max > 0 ? Math.min(100, (v.avg / timeStats.overall.max) * 100) : 0
                              return (
                                <div key={m} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold">{m}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{v.count} runs</div>
                                  </div>
                                  <div className="mt-2 text-sm">Avg: <span className={`font-medium ${accent}`}>{v.avg.toFixed(2)}s</span></div>
                                  <div className="text-sm">Median: <span className="font-medium">{v.median.toFixed(2)}s</span></div>
                                  <div className="text-sm">Min: <span className="font-medium">{v.min.toFixed(2)}s</span> · Max: <span className="font-medium">{v.max.toFixed(2)}s</span></div>
                                  <div className="mt-3">
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                      <div className={`h-2 rounded bg-gradient-to-r ${accent}`} style={{ width: `${widthPct}%` }} />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {data.summary && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Summary</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                    {Object.entries(data.summary).map(([m, s]) => {
                      const ss: any = s
                      return <li key={m}>{m}: {ss.success}/{ss.count} successful</li>
                    })}
                  </ul>
                </div>
              )}

              {data.results && (
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 dark:scrollbar-thumb-green-400 scrollbar-track-green-100 dark:scrollbar-track-green-900/20 hover:scrollbar-thumb-green-600 dark:hover:scrollbar-thumb-green-300">
                  <table className="w-full text-sm table-auto dark:text-white">
                    <thead>
                      <tr className="text-left text-xs text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700">
                        <th className="p-2">Query</th>
                        <th className="p-2">Model</th>
                        <th className="p-2">Time(s)</th>
                        <th className="p-2">Rows</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Features</th>
                        <th className="p-2">SQL (trim)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((r: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="p-2 align-top max-w-[220px] truncate dark:text-white">{r.query}</td>
                          <td className="p-2 align-top dark:text-white">{r.model}</td>
                          <td className="p-2 align-top dark:text-white">{r.time ? Number(r.time).toFixed(2) : 'N/A'}</td>
                          <td className="p-2 align-top dark:text-white">{r.rows ?? 'N/A'}</td>
                          <td className="p-2 align-top text-sm dark:text-white">{r.success ? 'OK' : (r.error ? `ERR` : 'ERR')}</td>
                          <td className="p-2 align-top dark:text-white">{r.features ? r.features.join(',') : '-'}</td>
                          <td className="p-2 align-top truncate max-w-[400px] dark:text-white">{(r.sql || '').replace(/\n/g, ' ').slice(0, 160)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Page-scoped global CSS: when the site is in dark mode, force text inside this page to white for maximum visibility. */
<style jsx global>{`
.dark .test-models-container, .dark .test-models-container * {
  color: #ffffff !important;
}
.dark .test-models-container .bg-white, .dark .test-models-container .bg-gray-50 {
  background-color: inherit !important;
}
`}</style>


