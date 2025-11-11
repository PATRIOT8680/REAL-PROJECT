import { memo } from "react";
import { IDataChar } from "./Index.tsx";
import Info from "./pages/Info.tsx"
import Gens from "./pages/Gens.tsx";
import Face from "./pages/Face.tsx";
import Clothes from "./pages/Clothes.tsx";

interface ICurrentSection {
  currentPage: string,
  dataChar: IDataChar,
  handleChange: (fieldName: string, value: any) => void,
  errors: { [key: string]: string }
}

const CurrentSection = memo(({ currentPage, dataChar, handleChange, errors }: ICurrentSection) => {
  const renderSection = () => {
    switch (currentPage) {
      case 'info':
        return <Info dataChar={dataChar} handleChange={handleChange} errors={errors} />
      case 'gens':
        return <Gens dataChar={dataChar} handleChange={handleChange}  />
      case 'face':
        return <Face dataChar={dataChar} handleChange={handleChange}  />
      case 'clothes':
        return <Clothes dataChar={dataChar} handleChange={handleChange} />
      default:
        return <Info dataChar={dataChar} handleChange={handleChange} errors={errors} />
    }
  }

  return (
      <div
          className="current-section"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
      >
        { renderSection() }
      </div>
  )
})

export default CurrentSection;