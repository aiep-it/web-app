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
            <Button
              isIconOnly
              color={isGridView ? 'primary' : 'default'}
              onPress={() => {
                setIsGridView(true);
                onChangeView(true);
              }}
            >
              <Icon icon="lucide:grid" className="text-lg" />
            </Button>
            <Button
              isIconOnly
              color={!isGridView ? 'primary' : 'default'}
              onPress={() => {
                setIsGridView(false);
                onChangeView(false);
              }}
            >
              <Icon icon="lucide:list" className="text-lg" />
            </Button>
          </ButtonGroup>
        )}
      </div>
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {onRefesh && (
            <Button
              color="primary"
              variant="flat"
              startContent={<Icon icon="lucide:refresh-cw" />}
              size="sm"
              onPress={onRefesh}
            >
              Làm mới
            </Button>
          )}

          {onSort && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Icon icon="lucide:list-filter" />}
                  endContent={
                    <Icon icon="lucide:chevron-down" className="text-small" />
                  }
                  size="sm"
                >
                  Sắp xếp
                </Button>
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

        <div className="w-full sm:w-64 flex justify-between items-center mb-4 flex-col sm:flex-row gap-3">
          {onSearch && (
            <Input
              // ref={inputRef}
              placeholder="Tìm kiếm "
              startContent={<Icon icon="lucide:search" />}
              value={searchValue}
              onValueChange={handleSearch}
              isClearable
              classNames={{
                input: 'placeholder:text-default-500',
              }}
            />
          )}
          {addRecord && (
            <Button
              isIconOnly
              color={'success'}
              onPress={() => {
                addRecord();
              }}
            >
              <Icon icon="lucide:plus" className="text-lg" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPageHeader;
