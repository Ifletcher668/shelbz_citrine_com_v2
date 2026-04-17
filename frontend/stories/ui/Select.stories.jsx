import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";

const meta = {
  title: "UI/Select",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Radix UI Select — dropdown selection with keyboard navigation.",
      },
    },
  },
};

export default meta;

export const Default = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a metal" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Metal</SelectLabel>
            <SelectItem value="14kt-gold">14kt Gold</SelectItem>
            <SelectItem value="18kt-gold">18kt Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
            <SelectItem value="palladium">Palladium</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroupedOptions = {
  name: "Grouped Options",
  render: () => (
    <div className="w-72">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a budget range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Commission Budget</SelectLabel>
            <SelectItem value="2k-4k">$2,000 – $4,000</SelectItem>
            <SelectItem value="4k-7k">$4,000 – $7,000</SelectItem>
            <SelectItem value="7k-plus">$7,000+</SelectItem>
            <SelectItem value="flexible">Flexible / Discuss</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Legendary Tier</SelectLabel>
            <SelectItem value="15k-plus">$15,000+ (Legendary)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled = {
  render: () => (
    <div className="w-64">
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Unavailable" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">Option</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
