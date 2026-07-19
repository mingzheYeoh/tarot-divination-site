import { describe, it, expect } from 'vitest'
import { colors, fontFamily, fontSize, borderRadius, spacing } from './tokens'

describe('design tokens', () => {
  it('has 53 color tokens matching the Stitch design system', () => {
    expect(Object.keys(colors)).toHaveLength(53)
    expect(colors.primary).toBe('#ebc166')
    expect(colors['background-void']).toBe('#0B0714')
    expect(colors['card-back']).toBe('#3D0C29')
    expect(colors['surface-container']).toBe('#221d2c')
  })

  it('defines the Cinzel/Playfair Display/Inter font families', () => {
    expect(fontFamily['display-lg']).toEqual(['Cinzel'])
    expect(fontFamily['tagline-italic']).toEqual(['Playfair Display'])
    expect(fontFamily['body-md']).toEqual(['Inter'])
  })

  it('defines display-lg at 48px with the documented letter-spacing', () => {
    const [size, opts] = fontSize['display-lg']
    expect(size).toBe('48px')
    expect(opts).toMatchObject({ letterSpacing: '0.05em', fontWeight: '700' })
  })

  it('matches the borderRadius and spacing scale used across the Stitch exports', () => {
    expect(borderRadius.lg).toBe('0.5rem')
    expect(spacing['section-padding']).toBe('80px')
  })
})
