# cmpLeftNav - Control-by-Control Edit Guide

Use this guide while editing each control in Power Apps Studio.

---

## STEP 1: Add Custom Properties to Component

In the component's **Custom Properties** panel, add these:

| Property | Kind | Type | Default |
|----------|------|------|---------|
| `CompanyLogo` | Input | Image | *(your logo)* |
| `MenuItems` | Input | Table | `Table({Id:1,Name:"Home"},{Id:2,Name:"Settings"})` |
| `SelectedId` | Input | Number | `1` |
| `SelectedColor` | Input | Color | `Color.LightBlue` |
| `UnselectedColor` | Input | Color | `Color.White` |
| `BorderColor` | Input | Color | `Color.Black` |
| `ShowUserAvatar` | Input | Boolean | `true` |
| `NavWidth` | Input | Number | `80` |

---

## STEP 2: Update Component Root Properties

**Component Width:**
```
Self.NavWidth
```

**Component OnReset:**
```
// Leave empty - parent handles state
```

---

## STEP 3: Update Each Control

### conMenu.Width
```
cmpLeftNav.NavWidth
```

---

### imgCompanyLogo.Image
```
cmpLeftNav.CompanyLogo
```

---

### galMenu.Items
```
cmpLeftNav.MenuItems
```

---

### conMenuItems.BorderColor
```
If(ThisItem.Id = cmpLeftNav.SelectedId, cmpLeftNav.BorderColor, Color.Transparent)
```

---

### conMenuItems.Fill
```
If(ThisItem.Id = cmpLeftNav.SelectedId, cmpLeftNav.SelectedColor, cmpLeftNav.UnselectedColor)
```

---

### lblMenuText.Text
```
ThisItem.Name
```

---

### btnSelectItem.HoverFill
```
If(ThisItem.Id = cmpLeftNav.SelectedId, Color.Transparent, RGBA(255, 255, 255, 0.1))
```

---

### btnSelectItem.OnSelect

**Option A - Component triggers event, parent handles navigation:**
```
Select(Parent, ThisItem.Id)
```

**Option B - Direct navigation (MenuItems must have Screen column):**
```
Navigate(ThisItem.Screen)
```

---

### conUserImage.Visible
```
cmpLeftNav.ShowUserAvatar
```

---

## STEP 4: Using the Component in Your App

### On your screen, add cmpLeftNav and set these properties:

**CompanyLogo:**
```
YourLogoImageName
```

**MenuItems:**
```
Table(
    { Id: 1, Name: "Dashboard", Screen: DashboardScreen },
    { Id: 2, Name: "Production", Screen: ProductionScreen },
    { Id: 3, Name: "Planner", Screen: PlannerScreen },
    { Id: 4, Name: "Quality", Screen: QualityScreen },
    { Id: 5, Name: "Settings", Screen: SettingsScreen }
)
```

**SelectedId:**
```
varMenuSelected
```

**OnSelect (if using Option A above):**
```
Set(varMenuSelected, cmpLeftNav_1.SelectedId);
Navigate(
    LookUp(
        cmpLeftNav_1.MenuItems,
        Id = cmpLeftNav_1.SelectedId
    ).Screen
)
```

### In App.OnStart:
```
Set(varMenuSelected, 1)
```

---

## Summary of Changes from Original

| What Changed | Original | Generalized |
|--------------|----------|-------------|
| Company Logo | Hardcoded `AYR_MA` | `cmpLeftNav.CompanyLogo` property |
| Menu Items | Hardcoded 5-item table | `cmpLeftNav.MenuItems` property |
| Selected State | `varMenuSelected` variable | `cmpLeftNav.SelectedId` property |
| Colors | Hardcoded `Color.LightBlue` | Configurable color properties |
| OnSelect Logic | 50+ lines of hardcoded logic | Simple `Select(Parent, ThisItem.Id)` |
| User Avatar | Always shown | `ShowUserAvatar` toggle |
| Width | Hardcoded `80` | `NavWidth` property |
