import './assets/styles/compiled-css/InventorySlot.css'
import { DragEvent, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { Item } from "../../../actions/menus/inventory.ts";
import { rce } from "../../../modules/rce.ts";
import { CDN_URL } from "../../../main.tsx";

import svg_use from './assets/img/use.svg'
import svg_split from './assets/img/split.svg'
import svg_drop from './assets/img/drop.svg'
import img_err from './assets/img/err-img.png'
import svg_fast from './assets/img/fast.svg'

import SeparateItem from "./SeparateItem.tsx";

interface InventorySlotProps {
  slotId: number;
  item: Item | null;
  section: string;
  slotType: string;
  onDragStart?: (item: Item, slotIndex: number) => void;
  onDrop?: (slotIndex: number, sourceData: string) => void;
  isSlotsDisabled?: boolean;
  additionalData?: {
    backgroundIcon?: string;
    slotTypeLabel?: string;
  };
}

const InventorySlot = ({
  slotId,
  item,
  section,
  slotType,
  onDragStart,
  onDrop,
  isSlotsDisabled = false,
  additionalData
}: InventorySlotProps) => {
  const [showItemInfo, setShowItemInfo] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [infoPosition, setInfoPosition] = useState({ top: 0, left: 0 })
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true)
  const [visibleSeparate, setVisibleSeparate] = useState<boolean>(false)
  const [separate, setSeparate] = useState<number>(1)
  const [valueDrop, setValueDrop] = useState<number>(1)
  const slotRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const isLeavingRef = useRef<boolean>(false)
  const dragImageRef = useRef<HTMLDivElement>(null)
  const fastSlots = useSelector((state: RootState) => state.inventoryReducer.fastSlots)
  const [separateMenu, setSeparateMenu] = useState<{
    visible: boolean
    type: 'separated' | 'drop'
  }>({
    visible: false,
    type: 'separated'
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        slotRef.current &&
        !slotRef.current.contains(event.target as Node) &&
        infoRef.current &&
        !infoRef.current.contains(event.target as Node)
      ) {
        setShowItemInfo(false)
      }
    }

    const handleGlobalDragEnd = (e: DragEvent) => {
      setIsDragging(false)
      resetAllDragStates()
    }

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      resetAllDragStates()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('dragend', handleGlobalDragEnd as any)
    document.addEventListener('dragover', handleGlobalDragOver as any)
    document.addEventListener('drop', handleGlobalDrop as any)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('dragend', handleGlobalDragEnd as any)
      document.removeEventListener('dragover', handleGlobalDragOver as any)
      document.removeEventListener('drop', handleGlobalDrop as any)
    }
  }, [])

  useEffect(() => {
    if (!item) {
      setIsDragging(false)
    }
  }, [item])

  useEffect(() => {
    if (showItemInfo && slotRef.current && infoRef.current) {
      positionInfoElement()
    }
  }, [showItemInfo])

  const positionInfoElement = () => {
    if (!slotRef.current || !infoRef.current) return

    const slotRect = slotRef.current.getBoundingClientRect()
    const infoElement = infoRef.current

    // Позиционируем информацию над слотом
    let top = slotRect.top - infoElement.offsetHeight - 10
    let left = slotRect.left + slotRect.width / 2

    // Проверяем, чтобы не выходило за границы экрана
    const infoRect = {
      width: infoElement.offsetWidth,
      height: infoElement.offsetHeight
    }

    // Если выходит сверху, показываем под слотом
    if (top < 0) {
      top = slotRect.bottom + 10
    }

    // Если выходит слева
    if (left < infoRect.width / 2) {
      left = infoRect.width / 2 + 10
    }
    // Если выходит справа
    else if (left + infoRect.width / 2 > window.innerWidth) {
      left = window.innerWidth - infoRect.width / 2 - 10
    }

    setInfoPosition({ top, left })
  }

  const resetAllDragStates = () => {
    const allSlots = document.querySelectorAll('.inventory-slot')
    allSlots.forEach(slot => {
      slot.classList.remove('drag-source', 'drag-over')
    })
  }

  const handleDragStart = (e: DragEvent) => {
    if (!item || onDragStart === undefined) return

    e.dataTransfer.setData('text/plain', `${section}-${slotId}`)
    onDragStart(item, slotId)

    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 40, 40)
    }

    setIsDragging(true)
    e.currentTarget.classList.add('drag-source')
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)

    if (slotRef.current) {
      slotRef.current.classList.remove('drag-source')
    }

    e.currentTarget.classList.remove('drag-source')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop === undefined) return
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')

    const sourceData = e.dataTransfer.getData('text/plain')
    onDrop(slotId, sourceData)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (item) {
      setShowItemInfo(true)
    }
  }

  const handleSlotMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as Node

    if (infoRef.current && infoRef.current.contains(relatedTarget)) {
      return
    }

    isLeavingRef.current = true
    setTimeout(() => {
      if (isLeavingRef.current) {
        setShowItemInfo(false)
        isLeavingRef.current = false
      }
    }, 50)
  }

  const handleInfoMouseEnter = () => {
    isLeavingRef.current = false
  }

  const handleInfoMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as Node

    if (slotRef.current && slotRef.current.contains(relatedTarget)) {
      return
    }

    setShowItemInfo(false)
  }

  const handleUseItem = () => {
    if (!item) return

    rce.triggerServer('useItem', item.id, slotId, section)
    setShowItemInfo(false)
  }

  const getItemImage = (item: Item): string => {
    if (item.type === 'clothes' && item.clothesData) {
      const { type, gender, sectionId, drawable, texture } = item.clothesData
      const genderChar = gender === 'male' ? 'm' : 'f'

      return `${CDN_URL}/img/items/${type === 'clothes' ? 'clothes' : 'props'}/${genderChar}/${sectionId}/${drawable}/${texture || 0}.png`
    } else {
      const folderMap: Record<string, string> = {
        weapon: 'weapons',
        food: 'foods'
      }

      const folder = folderMap[item.type] || 'items'
      return `${CDN_URL}/img/items/${folder}/${item.imageId}.png`
    }
  }

  const getFastSlotNumber = () => {
    if (!item?.isFast) return null

    const slotIndex = fastSlots.findIndex((fastItem: any) =>
      fastItem && fastItem.id === item.id
    )

    if (slotIndex !== -1) {
      return slotIndex + 1
    }

    return null
  }

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsImageLoading(false);
    (e.target as HTMLImageElement).src = img_err
  }

  const handleDropOnGround = () => {
    if (!item) return

    if (item.quantity > 1) {
      setSeparateMenu({
        visible: true,
        type: 'drop'
      })

      setValueDrop(1)
      setShowItemInfo(false)
    } else {
      rce.triggerServer('dropItemOnGround', item.id, slotId, section, 1)
      setShowItemInfo(false)
    }
  }

  const handleShowSeparate = () => {
    const ignoredSections: string[] = ['fast', 'clothes', 'trade', 'returnTrade']
    if (!item) return
    if (item.quantity <= 1) return
    if (ignoredSections.includes(item.type)) return
    if (item?.isFast && section !== 'fast' && getFastSlotNumber() !== null) {
      window.App.sendNotifyReducer.sendNotify('err', 'Уберите предмет с быстрого слота!', 3000, 'top')
      return
    }

    setSeparateMenu({
      visible: true,
      type: 'separated'
    })

    setSeparate(1)
    setShowItemInfo(false)
  }

  const handleCloseSeparate = () => {
    setSeparateMenu({
      ...separateMenu,
      visible: false,
    })
  }

  return (
    <>
      {/* Скрытый элемент для drag image */}
      {item && (
        <div
          ref={dragImageRef}
          className="drag-preview"
          style={{
            position: 'absolute',
            top: '-1000px',
            left: '-1000px',
            width: '80px',
            height: '80px',
            transform: 'rotate(-15deg)',
            opacity: '1',
            pointerEvents: 'none'
          }}
        >
          <div className="item-content">
            <div className="item-img">
              {isImageLoading && (
                <div className="item-loader">
                  <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" stroke="white" strokeWidth="7"/>
                  </svg>
                </div>
              )}
              <img
                src={getItemImage(item)}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: isImageLoading ? 'none' : 'block' }}
              />
            </div>
            {item.quantity > 1 && (
              <span className="quantity-item">{item.quantity}</span>
            )}
          </div>
        </div>
      )}

      <div
        className={`
          inventory-slot ${slotType} 
          ${item ? 'filled' : 'empty'}
          ${showItemInfo ? 'hover' : ''}
          ${isDragging ? 'drag-source' : ''}
          ${isSlotsDisabled ? 'disabled' : ''}
        `}
        ref={slotRef}
        draggable={!!item}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDoubleClick={handleUseItem}
        onDrop={handleDrop}
        onMouseLeave={handleSlotMouseLeave}
        onContextMenu={handleContextMenu}
      >
        { section === 'fast' && (
          <span className="number-fast">{slotId + 1}</span>
        ) }

        { item ? (
          <>
            <div className="item-content">
              <div className="item-img">
                {isImageLoading && (
                  <div className="item-loader">
                    <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" stroke="white" strokeWidth="7"/>
                    </svg>
                  </div>
                )}
                <img
                  src={getItemImage(item)}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: isImageLoading ? 'none' : 'block' }}
                />
              </div>
              { item.quantity > 1 && section !== 'fast' && (
                <span className="quantity-item">{item.quantity}</span>
              ) }

              { item?.isFast && section !== 'fast' && getFastSlotNumber() !== null && (
                <div className="is-fast-item">
                  <img src={svg_fast} />
                </div>
              ) }
            </div>
            { showItemInfo && (
              <div
                ref={infoRef}
                className="information-item"
                onMouseEnter={handleInfoMouseEnter}
                onMouseLeave={handleInfoMouseLeave}
                style={{
                  top: `${infoPosition.top}px`,
                  left: `${infoPosition.left}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <header className="header-info">
                  <span className="name-item">{item.name} (×{item.quantity})</span>
                  <span className="weight-item">{item.weight} кг</span>
                </header>
                <span className="description">{item.description}</span>
                <div className="btns-action">
                  <span className="btn" onClick={handleUseItem}>
                    <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.19653 4.77792V13.3621L5.03759 12.823L4.27477 12.6332L3.30756 12.3917L3.01251 12.3184C2.85986 12.2811 2.69905 12.2972 2.55681 12.3639C2.41458 12.4306 2.2995 12.544 2.23071 12.6851C2.16193 12.8262 2.14357 12.9866 2.17871 13.1396C2.21384 13.2926 2.30035 13.4289 2.42384 13.526L2.6642 13.7129L3.45149 14.3239L4.07039 14.804L7.15335 17.1992L11.0797 16.9389L15.8323 16.5307L16.7923 11.417L16.9478 10.5846L17.6026 7.09684L17.8156 5.96541L17.8286 5.89784C17.8733 5.70853 17.8408 5.50925 17.7384 5.34385C17.6359 5.17844 17.4719 5.06046 17.2824 5.01585C17.0929 4.97124 16.8934 5.00365 16.7278 5.10597C16.5622 5.20829 16.444 5.37212 16.3994 5.56143L16.3807 5.62756L16.064 6.73455L15.8323 7.54538L15.1127 10.0613H13.6734V2.9061C13.6706 2.71454 13.5948 2.53125 13.4613 2.39365C13.3279 2.25605 13.1469 2.17452 12.9553 2.16571C12.7637 2.1569 12.576 2.22148 12.4304 2.34626C12.2849 2.47103 12.1925 2.6466 12.1722 2.8371L12.165 2.9061L12.0642 4.02028L11.7533 7.44331L11.5418 9.76798L11.5144 10.0613H10.0751L10.0478 9.92756L9.57425 7.55976L9.35547 6.46715L8.98126 4.60109L8.79415 3.66374L8.76249 3.50848C8.72205 3.31804 8.61271 3.14919 8.45539 3.03428C8.29807 2.91936 8.10384 2.86645 7.9099 2.88568C7.71596 2.90491 7.53593 2.99493 7.4043 3.13849C7.27268 3.28206 7.1987 3.46908 7.19653 3.66374V4.77792ZM3.53641 10.2266L5.03759 10.6004V3.66374C5.03781 3.05966 5.22387 2.47024 5.57057 1.97528C5.91727 1.48032 6.40787 1.10373 6.97594 0.896494C7.54401 0.689261 8.16212 0.661396 8.74657 0.816671C9.33102 0.971947 9.85359 1.30286 10.2435 1.76462C10.5072 1.14878 10.9757 0.642737 11.5697 0.331975C12.1637 0.0212122 12.8469 -0.0752214 13.5039 0.0589644C14.1609 0.19315 14.7514 0.54973 15.1756 1.06847C15.5998 1.5872 15.8318 2.2363 15.8323 2.9061V3.16776C16.3143 2.93143 16.8527 2.83377 17.3871 2.88569C17.9215 2.93762 18.431 3.13709 18.8583 3.46178C19.2857 3.78646 19.6142 4.22355 19.807 4.72412C19.9999 5.22468 20.0494 5.76897 19.9501 6.29607L17.9538 16.9274C17.8671 17.3909 17.6307 17.8133 17.2808 18.1298C16.9309 18.4463 16.4868 18.6395 16.0165 18.6799L11.264 19.0868L11.2237 19.0897L7.29728 19.3513C6.76925 19.3861 6.24682 19.226 5.8292 18.9013L1.09825 15.2281C0.583135 14.8277 0.221456 14.2625 0.0737969 13.6274C-0.0738621 12.9923 0.00146904 12.3258 0.28717 11.7395C0.572872 11.1533 1.05159 10.6829 1.64312 10.4072C2.23466 10.1315 2.90308 10.0687 3.53641 10.2266ZM16.9881 22.2769C17.2698 22.2518 17.5305 22.1172 17.7139 21.9021C17.8973 21.687 17.9889 21.4086 17.9689 21.1267C17.9489 20.8449 17.819 20.5821 17.607 20.395C17.395 20.2079 17.118 20.1114 16.8355 20.1262L6.76043 20.845C6.61721 20.8525 6.47693 20.8885 6.34778 20.9508C6.21863 21.013 6.10319 21.1004 6.00822 21.2077C5.91325 21.3151 5.84064 21.4402 5.79464 21.5759C5.74864 21.7116 5.73017 21.8551 5.74031 21.998C5.75044 22.1409 5.78898 22.2803 5.85368 22.4082C5.91837 22.536 6.00792 22.6497 6.1171 22.7426C6.22627 22.8355 6.35288 22.9057 6.48954 22.9492C6.62619 22.9926 6.77015 23.0085 6.91299 22.9957L16.9881 22.2769Z" fill="#FCFCFD" fill-opacity="0.74" />
                    </svg>
                    <span className="text">Использовать</span>
                  </span>
                  <span className="btn" onClick={handleShowSeparate}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66667 0L8.19333 1.52667L6.27333 3.44667L7.22 4.39333L9.14 2.47333L10.6667 4V0H6.66667ZM4 0H0V4L1.52667 2.47333L4.66667 5.60667V10.6667H6V5.06L2.47333 1.52667L4 0Z" fill="#FCFCFD"/>
                    </svg>
                    <span className="text">Отделить</span>
                  </span>
                  <span className="btn" onClick={handleDropOnGround}>
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.33333 4H6.66667V0H2.66667V4H0L4.66667 8.66667L9.33333 4ZM4 5.33333V1.33333H5.33333V5.33333H6.11333L4.66667 6.78L3.22 5.33333H4ZM0 10H9.33333V11.3333H0V10Z" fill="#FCFCFD"/>
                    </svg>
                    <span className="text">Выбросить</span>
                  </span>
                </div>
              </div>
            ) }
          </>
        ) : (
          <>
            { slotType === 'clothes' && (
              <>
                <img src={additionalData?.backgroundIcon} className='bg-clothes-icon' />
                <span className="name-type-clothes">{additionalData?.slotTypeLabel}</span>
              </>
            ) }
          </>
        ) }
      </div>
      { separateMenu.visible && item && (
        <SeparateItem
          item={item}
          slotId={slotId}
          section={section}
          type={separateMenu.type}
          max={false}
          value={separateMenu.type === 'separated' ? separate : valueDrop}
          setValue={separateMenu.type === 'separated' ? setSeparate : setValueDrop}
          onClose={handleCloseSeparate}
        />
      ) }
    </>
  )
}

export default InventorySlot