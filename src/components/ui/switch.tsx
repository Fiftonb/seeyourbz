import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'
import { forwardRef } from 'react'

export function SwitchGroup({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        'space-y-3 **:data-[slot=label]:font-normal',
        // With descriptions
        'has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium'
      )}
    />
  )
}

export function SwitchField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={clsx(
        className,
        // Base layout
        'grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]',
        // Control layout
        '*:data-[slot=control]:col-start-2 *:data-[slot=control]:self-start sm:*:data-[slot=control]:mt-0.5',
        // Label layout
        '*:data-[slot=label]:col-start-1 *:data-[slot=label]:row-start-1',
        // Description layout
        '*:data-[slot=description]:col-start-1 *:data-[slot=description]:row-start-2',
        // With description
        'has-data-[slot=description]:**:data-[slot=label]:font-medium'
      )}
    />
  )
}

const colors = {
  'dark/zinc': {
    checked: 'data-[checked]:bg-zinc-900 dark:data-[checked]:bg-white/25',
    thumb: 'group-data-[checked]:bg-white dark:group-data-[checked]:bg-[--switch]',
  },
  'dark/white': {
    checked: 'data-[checked]:bg-zinc-900 dark:data-[checked]:bg-white',
    thumb: 'group-data-[checked]:bg-white dark:group-data-[checked]:bg-zinc-900',
  },
  dark: {
    checked: 'data-[checked]:bg-zinc-900 dark:data-[checked]:bg-[--switch-bg]',
    thumb: 'group-data-[checked]:bg-white',
  },
  zinc: {
    checked: 'data-[checked]:bg-zinc-600',
    thumb: 'group-data-[checked]:bg-white',
  },
  white: {
    checked: 'data-[checked]:bg-white',
    thumb: 'group-data-[checked]:bg-zinc-950',
  },
  red: {
    checked: 'data-[checked]:bg-red-600',
    thumb: 'group-data-[checked]:bg-white',
  },
  orange: {
    checked: 'data-[checked]:bg-orange-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  amber: {
    checked: 'data-[checked]:bg-amber-400',
    thumb: 'group-data-[checked]:bg-amber-950',
  },
  yellow: {
    checked: 'data-[checked]:bg-yellow-300',
    thumb: 'group-data-[checked]:bg-yellow-950',
  },
  lime: {
    checked: 'data-[checked]:bg-lime-300',
    thumb: 'group-data-[checked]:bg-lime-950',
  },
  green: {
    checked: 'data-[checked]:bg-green-600',
    thumb: 'group-data-[checked]:bg-white',
  },
  emerald: {
    checked: 'data-[checked]:bg-emerald-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  teal: {
    checked: 'data-[checked]:bg-teal-600',
    thumb: 'group-data-[checked]:bg-white',
  },
  cyan: {
    checked: 'data-[checked]:bg-cyan-300',
    thumb: 'group-data-[checked]:bg-cyan-950',
  },
  sky: {
    checked: 'data-[checked]:bg-sky-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  blue: {
    checked: 'data-[checked]:bg-blue-600',
    thumb: 'group-data-[checked]:bg-white',
  },
  indigo: {
    checked: 'data-[checked]:bg-indigo-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  violet: {
    checked: 'data-[checked]:bg-violet-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  purple: {
    checked: 'data-[checked]:bg-purple-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  fuchsia: {
    checked: 'data-[checked]:bg-fuchsia-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  pink: {
    checked: 'data-[checked]:bg-pink-500',
    thumb: 'group-data-[checked]:bg-white',
  },
  rose: {
    checked: 'data-[checked]:bg-rose-500',
    thumb: 'group-data-[checked]:bg-white',
  },
}

type Color = keyof typeof colors

export const Switch = forwardRef(function Switch(
  {
    color = 'dark/zinc',
    className,
    checked,
    onChange,
    ...props
  }: {
    color?: Color
    className?: string
    checked?: boolean
    onChange?: (checked: boolean) => void
  } & Omit<Headless.SwitchProps, 'as' | 'className' | 'children' | 'checked' | 'onChange'>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const colorClasses = colors[color] || colors['dark/zinc']

  return (
    <Headless.Switch
      ref={ref}
      data-slot="control"
      {...props}
      checked={checked}
      onChange={onChange}
      className={clsx(
        className,
        // Base styles
        'group relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8',
        // Transitions
        'transition duration-300 ease-in-out',
        // Outline and background color in forced-colors mode so switch is still visible
        'forced-colors:outline forced-colors:[--switch-bg:Highlight] dark:forced-colors:[--switch-bg:Highlight]',
        // Unchecked
        'bg-zinc-200 ring-1 ring-black/5 ring-inset dark:bg-white/5 dark:ring-white/15',
        // Checked
        colorClasses.checked,
        // Focus
        'focus:not-data-focus:outline-hidden data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500',
        // Hover
        'data-[hover]:ring-black/15',
        'dark:data-[hover]:ring-white/25',
        // Disabled
        'data-[disabled]:bg-zinc-200 data-[disabled]:opacity-50 data-[disabled]:data-[checked]:bg-zinc-200 data-[disabled]:data-[checked]:ring-black/5',
        'dark:data-[disabled]:bg-white/15 dark:data-[disabled]:data-[checked]:bg-white/15 dark:data-[disabled]:data-[checked]:ring-white/15'
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          // Basic layout
          'pointer-events-none relative inline-block h-[18px] w-[18px] rounded-full sm:h-[14px] sm:w-[14px]',
          // Transition
          'translate-x-0 transition duration-300 ease-in-out',
          // Invisible border so the switch is still visible in forced-colors mode
          'border border-transparent',
          // Unchecked
          'bg-white shadow-sm ring-1 ring-black/5',
          // Checked
          colorClasses.thumb,
          'group-data-[checked]:translate-x-4 sm:group-data-[checked]:translate-x-3',
          // Disabled
          'group-data-[checked]:group-data-[disabled]:bg-white group-data-[checked]:group-data-[disabled]:shadow-sm group-data-[checked]:group-data-[disabled]:ring-black/5'
        )}
      />
    </Headless.Switch>
  )
})
