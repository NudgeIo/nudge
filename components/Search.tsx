import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import React from 'react'

export interface SearchBarProps {
  className?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  containerClassName?: string
  inputClassName?: string
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
    (props, ref) => (
      <div 
        className={twMerge(
          'flex h-[56px] p-3 items-center gap-3 self-stretch border bg-white rounded-3xl',
          props.disabled && 'opacity-50',
          props.containerClassName,
        )}
      >
        {props.leftIcon ? <span className="mx-2">{props.leftIcon}</span> : null}
        <input
          ref={ref}
          id={props.id}
          type="text"
          disabled={props.disabled}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          className={twMerge(
            'flex-1 text-sm bg-transparent border-none outline-none focus:ring-0',
            props.inputClassName,
          )}
        />
        {props.rightIcon ? <span className="mx-2">{props.rightIcon}</span> : null}
      </div>
    ),
  )
  

SearchBar.displayName = 'SearchBar'

export default SearchBar
