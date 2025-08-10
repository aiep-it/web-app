import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { CustomButton } from '@/shared/components/button/CustomButton';

interface IProps {
  title: string;
  icon?: string;
  subTitle?: string;

  onChangeView?: (isGridView: boolean) => void;
  onRefesh?: () => void;
  onSort?: (key: string) => void | Promise<void>;
  onSearch?: (value: string) => void | Promise<void>;
  addRecord?: () => void;
}
const AdminPageHeader: React.FC<IProps> = ({
  title,
  icon,
  subTitle,
  onRefesh,
  onSort,
  onSearch,
  onChangeView,
  addRecord,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isGridView, setIsGridView] = useState<boolean>(true);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  //   useEffect(() => {
  //     onChangeView(isGridView)
  //   },[isGridView])
  return (
    <div>
      {' '}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Icon icon={`lucide:${icon}`} className="text-primary-500" />
            {title}
          </h2>
          {subTitle && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-default-500 text-sm font-medium">
                {subTitle}
              </span>
            </div>
          )}
        </div>

        {onChangeView && (
          <ButtonGroup>
            <CustomButton
              isIconOnly
              preset={isGridView ? 'primary' : 'ghost'}
              icon="lucide:grid"
              iconSize={18}
              onPress={() => {
                setIsGridView(true);
                onChangeView(true);
              }}
            >
              <span className="sr-only">Grid View</span>
            </CustomButton>
            <CustomButton
              isIconOnly
              preset={!isGridView ? 'primary' : 'ghost'}
              icon="lucide:list"
              iconSize={18}
              onPress={() => {
                setIsGridView(false);
                onChangeView(false);
              }}
            >
              <span className="sr-only">List View</span>
            </CustomButton>
          </ButtonGroup>
        )}
      </div>
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {onRefesh && (
            <CustomButton
              preset="primary"
              size="sm"
              icon="lucide:refresh-cw"
              iconSize={16}
              onPress={onRefesh}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Làm mới
            </CustomButton>
          )}

          {onSort && (
            <Dropdown>
              <DropdownTrigger>
                <CustomButton
                  preset="outline"
                  size="sm"
                  icon="lucide:list-filter"
                  iconSize={16}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Sắp xếp
                  <Icon
                    icon="lucide:chevron-down"
                    className="text-small ml-1"
                  />
                </CustomButton>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Sorting Options"
                onAction={(key) => onSort(key as string)}
              >
                <DropdownItem key="date_desc">Mới nhất</DropdownItem>
                <DropdownItem key="name_asc">A-Z</DropdownItem>
                <DropdownItem key="name_desc">Z-A</DropdownItem>
                <DropdownItem key="members">Nhiều thành viên nhất</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onSearch && (
            <Input
              // ref={inputRef}
              placeholder="Tìm kiếm "
              startContent={<Icon icon="lucide:search" />}
              value={searchValue}
              onValueChange={handleSearch}
              isClearable
              className="w-full sm:w-64"
              classNames={{
                input: 'placeholder:text-default-500',
              }}
            />
          )}
          {addRecord && (
            <Button
              size="md"
              startContent={<Icon icon="lucide:plus" width={16} />}
              onPress={() => {
                addRecord();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm flex-shrink-0"
            >
              Create new
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPageHeader;
