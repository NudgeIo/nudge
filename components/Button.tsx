import { ChevronDownIcon, LoadingIcon } from './Icons/Icons'
import { ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'
import React from 'react'

export interface ButtonProps {
  className?: string
  dropDownClassName?: string
  disabled?: boolean
  label: string | null | JSX.Element
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  hasDropdown?: boolean
  onClick?: (...args: any[]) => void
  onClickDropdown?: (...args: any[]) => void
  isLoading?: boolean
  containerClassName?: string
  labelClassName?: string
  type?: 'button' | 'submit'
  form?: string
  tabIndex?: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', form, ...props }, ref) => (
    <div ref={ref as any} className={twMerge('flex flex-row', props.containerClassName)}>
      <button
        form={form}
        type={type}
        disabled={props.disabled || props.isLoading}
        onClick={props.onClick}
        className={twMerge(
          'flex',
          props.hasDropdown ? 'rounded-l-lg' : '',
          'px-3.5 py-2 w-full text-left text-sm items-center',
          props.className,
          props.disabled && 'opacity-50 cursor-not-allowed',
        )}
        tabIndex={props.tabIndex}
      >
        {props.leftIcon}
        {props.label && (
          <span
            className={twMerge(
              'flex-1 font-medium',
              props.labelClassName,
              props.leftIcon && props.label && 'pl-3',
            )}
          >
            {props.label}
          </span>
        )}
        {props.rightIcon ? <span className="mr-2.5" /> : null}
        {props.rightIcon}
        {props.isLoading && <LoadingIcon className="ml-2.5 w-4 h-4 animate-spin" />}
      </button>
      {props.hasDropdown && (
        <div className={'flex flex-row'}>
          <div className={'bg-transparent h-full w-[1px]'} />
          <button
            className={`${props.dropDownClassName} min-w-0 pl-2 pr-2 rounded-r-lg`}
            onClick={props.onClickDropdown}
          >
            <ChevronDownIcon className={'w-4'} />
          </button>
        </div>
      )}
    </div>
  ),
)

Button.displayName = 'Button'

export default Button
